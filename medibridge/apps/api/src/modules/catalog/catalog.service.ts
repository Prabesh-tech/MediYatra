import { Injectable, NotFoundException } from "@nestjs/common";
import type { CatalogQueryInput } from "@medibridge/shared";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listTreatments(query: CatalogQueryInput) {
    const where = {
      published: true,
      ...(query.specialty ? { specialty: { slug: query.specialty } } : {}),
      ...(query.q ? {
        OR: [
          { name: { contains: query.q, mode: "insensitive" as const } },
          { summary: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.treatment.findMany({
        where,
        include: { specialty: true },
        orderBy: { name: "asc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.treatment.count({ where }),
    ]);
    return { data, total };
  }

  async getTreatment(slug: string) {
    const treatment = await this.prisma.treatment.findFirst({
      where: { slug, published: true },
      include: {
        specialty: true,
        hospitals: {
          where: { hospital: { verified: true, published: true } },
          include: { hospital: true },
        },
        doctors: {
          where: { doctor: { published: true, hospital: { is: { verified: true, published: true } } } },
          include: { doctor: { include: { hospital: true } } },
        },
        faqs: { orderBy: { order: "asc" } },
      },
    });
    if (!treatment) throw new NotFoundException("Treatment not found");
    return treatment;
  }

  async listHospitals(query: CatalogQueryInput) {
    const where = {
      verified: true,
      published: true,
      ...(query.city ? { city: { contains: query.city, mode: "insensitive" as const } } : {}),
      ...(query.country ? { country: { contains: query.country, mode: "insensitive" as const } } : {}),
      ...(query.accreditation ? { accreditations: { has: query.accreditation } } : {}),
      ...(query.minRating !== undefined ? { rating: { gte: query.minRating } } : {}),
      ...(query.q ? {
        OR: [
          { name: { contains: query.q, mode: "insensitive" as const } },
          { city: { contains: query.q, mode: "insensitive" as const } },
          { country: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.hospital.findMany({
        where,
        include: { _count: { select: { doctors: true, treatments: true, reviews: true } } },
        orderBy: [{ rating: "desc" }, { name: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.hospital.count({ where }),
    ]);
    return { data, total };
  }

  async getHospital(slug: string) {
    const hospital = await this.prisma.hospital.findFirst({
      where: { slug, verified: true, published: true },
      include: {
        treatments: { where: { treatment: { published: true } }, include: { treatment: { include: { specialty: true } } } },
        doctors: { where: { published: true }, orderBy: { name: "asc" } },
      },
    });
    if (!hospital) throw new NotFoundException("Hospital not found");
    return hospital;
  }

  async listDoctors(query: CatalogQueryInput) {
    const where = {
      published: true,
      hospital: { is: { verified: true, published: true } },
      ...(query.specialty ? { treatments: { some: { treatment: { slug: query.specialty, published: true } } } } : {}),
      ...(query.q ? {
        OR: [
          { name: { contains: query.q, mode: "insensitive" as const } },
          { title: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.doctor.findMany({
        where,
        include: { hospital: true, treatments: { include: { treatment: true } } },
        orderBy: [{ rating: "desc" }, { name: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.doctor.count({ where }),
    ]);
    return { data, total };
  }

  async getDoctor(slug: string) {
    const doctor = await this.prisma.doctor.findFirst({
      where: { slug, published: true, hospital: { is: { verified: true, published: true } } },
      include: { hospital: true, treatments: { include: { treatment: { include: { specialty: true } } } } },
    });
    if (!doctor) throw new NotFoundException("Doctor not found");
    return doctor;
  }

  async listDestinations(query: CatalogQueryInput) {
    const where = {
      published: true,
      ...(query.city ? { city: { contains: query.city, mode: "insensitive" as const } } : {}),
      ...(query.country ? { country: { contains: query.country, mode: "insensitive" as const } } : {}),
      ...(query.q ? {
        OR: [
          { city: { contains: query.q, mode: "insensitive" as const } },
          { country: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.destination.findMany({
        where,
        orderBy: [{ country: "asc" }, { city: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.destination.count({ where }),
    ]);
    return { data, total };
  }

  async getDestination(slug: string) {
    const destination = await this.prisma.destination.findFirst({
      where: { slug, published: true },
      include: { packages: { where: { published: true }, include: { treatment: true } } },
    });
    if (!destination) throw new NotFoundException("Destination not found");
    return destination;
  }

  async listPackages(query: CatalogQueryInput) {
    const where = {
      published: true,
      ...(query.country ? { destination: { is: { country: { contains: query.country, mode: "insensitive" as const }, published: true } } } : {}),
      ...(query.q ? { name: { contains: query.q, mode: "insensitive" as const } } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.package.findMany({
        where,
        include: { treatment: true, destination: true },
        orderBy: { name: "asc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.package.count({ where }),
    ]);
    return { data, total };
  }

  async listBlogPosts(query: CatalogQueryInput) {
    const where = {
      published: true,
      publishedAt: { lte: new Date() },
      ...(query.q ? {
        OR: [
          { title: { contains: query.q, mode: "insensitive" as const } },
          { excerpt: { contains: query.q, mode: "insensitive" as const } },
        ],
      } : {}),
    };
    const [data, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImage: true,
          category: true,
          tags: true,
          publishedAt: true,
        },
        orderBy: { publishedAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return { data, total };
  }

  async getBlogPost(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, published: true, publishedAt: { lte: new Date() } },
    });
    if (!post) throw new NotFoundException("Article not found");
    return post;
  }
}
