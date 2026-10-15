import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { catalogQuerySchema } from "@medibridge/shared";
import { Public } from "../../common/decorators/public.decorator";
import { CatalogService } from "./catalog.service";

function parseQuery(query: Record<string, string | undefined>) {
  const parsed = catalogQuerySchema.safeParse(query);
  if (!parsed.success) {
    throw new BadRequestException({
      message: "Invalid catalog query",
      issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    });
  }
  return parsed.data;
}

function paginatedResult(result: { data: unknown[]; total: number }, page: number, pageSize: number) {
  return {
    data: result.data,
    meta: { page, pageSize, total: result.total, pageCount: Math.ceil(result.total / pageSize) },
  };
}

@Public()
@ApiTags("treatments")
@Controller("treatments")
export class TreatmentsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listTreatments(filters), filters.page, filters.pageSize);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    return { data: await this.catalog.getTreatment(slug) };
  }
}

@Public()
@ApiTags("hospitals")
@Controller("hospitals")
export class HospitalsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listHospitals(filters), filters.page, filters.pageSize);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    return { data: await this.catalog.getHospital(slug) };
  }
}

@Public()
@ApiTags("doctors")
@Controller("doctors")
export class DoctorsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listDoctors(filters), filters.page, filters.pageSize);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    return { data: await this.catalog.getDoctor(slug) };
  }
}

@Public()
@ApiTags("destinations")
@Controller("destinations")
export class DestinationsController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listDestinations(filters), filters.page, filters.pageSize);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    return { data: await this.catalog.getDestination(slug) };
  }
}

@Public()
@ApiTags("packages")
@Controller("packages")
export class PackagesController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listPackages(filters), filters.page, filters.pageSize);
  }
}

@Public()
@ApiTags("blog")
@Controller("blog")
export class BlogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  async list(@Query() query: Record<string, string | undefined>) {
    const filters = parseQuery(query);
    return paginatedResult(await this.catalog.listBlogPosts(filters), filters.page, filters.pageSize);
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    return { data: await this.catalog.getBlogPost(slug) };
  }
}
