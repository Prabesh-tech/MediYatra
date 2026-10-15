export type SupportedLocale = "en";

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export type LeadStatus = "NEW" | "CONTACTED" | "IN_PROGRESS" | "CLOSED";
