import { z } from "zod";

export const supportedLocaleSchema = z.enum(["en"]);

export const quoteRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  treatment: z.string().trim().min(1).max(160),
  destination: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestSchema>;

export const inquiryRequestSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(32),
  country: z.string().trim().min(2).max(100),
  treatmentId: z.string().cuid().optional(),
  treatment: z.string().trim().max(160).optional(),
  conditionText: z.string().trim().min(10).max(8000),
  preferredCountry: z.string().trim().max(100).optional(),
  preferredCity: z.string().trim().max(100).optional(),
  timeline: z.string().trim().max(100).optional(),
  budgetUsd: z.number().int().positive().max(10_000_000).optional(),
  consent: z.literal(true),
  consentPolicyVersion: z.string().trim().min(1).max(32),
}).strict();

export type InquiryRequestInput = z.infer<typeof inquiryRequestSchema>;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
}).strict();

export const emailTokenSchema = z.object({
  token: z.string().min(32).max(256),
}).strict();

export const passwordResetSchema = emailTokenSchema.extend({
  password: z.string().min(12).max(128),
}).strict();

export const emailSchema = z.object({
  email: z.string().trim().email().max(254),
}).strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

export const documentUploadSchema = z.object({
  filename: z.string().trim().min(1).max(180),
  contentType: z.enum(["application/pdf", "image/jpeg"]),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
}).strict();

export const completeDocumentUploadSchema = documentUploadSchema.extend({
  key: z.string().min(1).max(512),
  inquiryId: z.string().cuid().optional(),
}).strict();

export const guestDocumentCompleteSchema = documentUploadSchema.extend({
  key: z.string().min(1).max(512),
}).strict();

export const guestDocumentPresignSchema = documentUploadSchema.extend({
  uploadToken: z.string().min(32).max(128),
}).strict();

export const guestDocumentCompleteWithGrantSchema = guestDocumentCompleteSchema.extend({
  uploadToken: z.string().min(32).max(128),
}).strict();

export type DocumentUploadInput = z.infer<typeof documentUploadSchema>;
export type CompleteDocumentUploadInput = z.infer<typeof completeDocumentUploadSchema>;
export type GuestDocumentCompleteInput = z.infer<typeof guestDocumentCompleteSchema>;

export const catalogQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
  city: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  specialty: z.string().trim().max(120).optional(),
  accreditation: z.string().trim().max(80).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
}).strict();

export type CatalogQueryInput = z.infer<typeof catalogQuerySchema>;

export const profileUpdateSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().min(7).max(32).optional(),
  locale: supportedLocaleSchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0);

export const dataRequestSchema = z.object({
  type: z.enum(["EXPORT", "DELETE"]),
}).strict();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type DataRequestInput = z.infer<typeof dataRequestSchema>;

export const adminInquiryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  status: z.enum(["NEW", "CONTACTED", "QUOTE_SENT", "CONFIRMED", "TREATED", "CLOSED"]).optional(),
  q: z.string().trim().max(120).optional(),
}).strict();

export const adminInquiryUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTE_SENT", "CONFIRMED", "TREATED", "CLOSED"]).optional(),
  assignedCoordinatorId: z.string().cuid().nullable().optional(),
  notes: z.string().trim().max(4000).optional(),
}).strict().refine((value) =>
  value.status !== undefined
  || value.assignedCoordinatorId !== undefined
  || value.notes !== undefined,
);

export const reviewModerationSchema = z.object({
  approved: z.boolean(),
}).strict();

export type AdminInquiryQueryInput = z.infer<typeof adminInquiryQuerySchema>;
export type AdminInquiryUpdateInput = z.infer<typeof adminInquiryUpdateSchema>;

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(3000),
  consent: z.literal(true),
}).strict();

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const contactMessageQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  status: z.enum(["NEW", "REVIEWED", "CLOSED"]).optional(),
}).strict();

export type ContactMessageQueryInput = z.infer<typeof contactMessageQuerySchema>;

export const contactMessageUpdateSchema = z.object({
  status: z.enum(["REVIEWED", "CLOSED"]),
}).strict();

export const appointmentRequestSchema = z.object({
  type: z.enum(["video", "phone", "in-person"]),
  scheduledAt: z.string().datetime(),
  timezone: z.string().trim().min(1).max(64),
  doctorId: z.string().cuid().optional(),
  inquiryId: z.string().cuid().optional(),
}).strict();

export type AppointmentRequestInput = z.infer<typeof appointmentRequestSchema>;

export const reviewSubmissionSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(160).optional(),
  body: z.string().trim().min(20).max(3000),
  consentToPublish: z.literal(true),
}).strict();

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionSchema>;
