import { apiFetch } from './api';

export interface Announcement {
  _id: string;
  text: string;
  link?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * PUBLIC: Fetch all active announcements
 */
export async function getActiveAnnouncements(): Promise<{ success: boolean; data: Announcement[] }> {
  return apiFetch('/announcements');
}

/**
 * ADMIN: Fetch all announcements (paginated)
 */
export async function getAdminAnnouncements(
  page = 1,
  limit = 20
): Promise<{
  success: boolean;
  data: {
    announcements: Announcement[];
    pagination: { total: number; page: number; limit: number; pages: number };
  };
}> {
  return apiFetch(`/announcements/admin?page=${page}&limit=${limit}`);
}

/**
 * ADMIN: Create a new announcement
 */
export async function createAnnouncement(data: {
  text: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}): Promise<{ success: boolean; data: Announcement; message: string }> {
  return apiFetch('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * ADMIN: Update an announcement
 */
export async function updateAnnouncement(
  id: string,
  data: {
    text?: string;
    link?: string | null;
    isActive?: boolean;
    order?: number;
  }
): Promise<{ success: boolean; data: Announcement; message: string }> {
  return apiFetch(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * ADMIN: Delete an announcement
 */
export async function deleteAnnouncement(
  id: string
): Promise<void> {
  return apiFetch(`/announcements/${id}`, {
    method: 'DELETE',
  });
}
