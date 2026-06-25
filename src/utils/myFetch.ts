/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { config } from "@/config/env-config";
import { getToken } from "./get-token";
import { revalidateTag } from "next/cache";

export interface FetchResponse {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  error?: string | null;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  tags?: string[];
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
}

export const myFetch = async (
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "force-cache",
  }: FetchOptions = {}
): Promise<FetchResponse> => {
  const accessToken = token || (await getToken());

  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  // Determine the resource name for tagging (e.g. "/sponsor?limit=100" -> "sponsor")
  const pathWithoutQuery = url.split("?")[0];
  const urlSegments = pathWithoutQuery.split("/").filter(Boolean);
  const resource = urlSegments[0]; // e.g. "sponsor", "user", "event"

  // Setup tags for caching
  const finalTags = tags || (resource ? [resource] : []);

  const fetchOptions: RequestInit = {
    method,
    headers: reqHeaders,
    ...(hasBody && { body: isFormData ? body : JSON.stringify(body) }),
    ...(method === "GET"
      ? {
          cache: cache === "no-store" ? "no-store" : "force-cache",
          next: { tags: finalTags },
        }
      : { cache: "no-store" }),
  };

  try {
    const response = await fetch(`${config.baseURL}${url}`, fetchOptions);

    const data = await response.json();

    if (response.ok) {
      // If mutation succeeded, automatically revalidate the resource tag
      if (method !== "GET" && resource) {
        try {
          revalidateTag(resource);
          console.log(`[myFetch] Automatically revalidated tag: "${resource}" after ${method} request to ${url}`);
        } catch (revalError) {
          console.error(`[myFetch] Error revalidating tag: "${resource}"`, revalError);
        }
      }

      return {
        success: data?.success ?? true,
        message: data?.message,
        data: data?.data,
        pagination: data?.pagination || data?.meta,
        error: null,
      };
    }

    return {
      success: false,
      message: data?.message,
      data: null,
      error: data?.errorMessages || "Request failed",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Network error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

