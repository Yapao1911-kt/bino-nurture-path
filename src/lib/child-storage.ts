import {
  saveChildProfile,
  getUserChildren,
  deleteChildProfile,
  type ChildData,
} from "./children-rpc";

export type { ChildData };

const STORAGE_CHILDREN_KEY = "bino_user_children";
const STORAGE_ACTIVE_CHILD_KEY = "bino_active_child";

export function getLocalChildren(): ChildData[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_CHILDREN_KEY);
    if (!raw) {
      // Kiểm tra fallback sang bino_local_children cũ nếu có
      const legacyRaw = localStorage.getItem("bino_local_children");
      if (legacyRaw) {
        const legacyList = JSON.parse(legacyRaw);
        if (Array.isArray(legacyList) && legacyList.length > 0) {
          const migrated: ChildData[] = legacyList.map((item: any) => ({
            id: item.id || Math.random().toString(36).substring(2),
            userId: localStorage.getItem("bino_user_id") || "local_user",
            name: item.full_name || item.name || "Bé",
            age: item.age || 4,
            dateOfBirth: item.date_of_birth || null,
            condition: Array.isArray(item.developmental_challenges)
              ? item.developmental_challenges[0]
              : item.condition || "Phát triển bình thường",
            developmentalChallenges: Array.isArray(item.developmental_challenges)
              ? item.developmental_challenges
              : [item.condition || "Phát triển bình thường"],
            communicationLevel: item.communication_level || "Bình thường",
            avatar: "🌻",
            createdAt: item.created_at || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));
          localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(migrated));
          return migrated;
        }
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error("[child-storage] getLocalChildren error:", e);
    return [];
  }
}

export function getActiveChild(): ChildData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_CHILD_KEY);
    if (raw) return JSON.parse(raw);
    const children = getLocalChildren();
    if (children.length > 0) {
      localStorage.setItem(STORAGE_ACTIVE_CHILD_KEY, JSON.stringify(children[0]));
      return children[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function setActiveChild(child: ChildData | null): void {
  if (typeof window === "undefined") return;
  if (child) {
    localStorage.setItem(STORAGE_ACTIVE_CHILD_KEY, JSON.stringify(child));
  } else {
    localStorage.removeItem(STORAGE_ACTIVE_CHILD_KEY);
  }
  window.dispatchEvent(new CustomEvent("bino_child_changed", { detail: child }));
}

export async function fetchAndSyncChildren(): Promise<ChildData[]> {
  if (typeof window === "undefined") return [];

  const userId = localStorage.getItem("bino_user_id") || undefined;
  const userEmail = localStorage.getItem("bino_user_email") || undefined;

  // Nếu không có user đăng nhập, đọc local
  if (!userId && !userEmail) {
    return [];
  }

  try {
    const res = await getUserChildren({ data: { userId, userEmail } });
    if (res.success && Array.isArray(res.children)) {
      localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(res.children));
      // Cập nhật active child nếu chưa có hoặc không còn trong danh sách
      const currentActive = getActiveChild();
      if (!currentActive || !res.children.some((c) => c.id === currentActive.id)) {
        if (res.children.length > 0) {
          setActiveChild(res.children[0]);
        } else {
          setActiveChild(null);
        }
      }
      return res.children;
    }
  } catch (err) {
    console.warn("[child-storage] Sync children with server failed, fallback to local:", err);
  }

  return [];
}

export async function saveNewChild(data: {
  name: string;
  age: number;
  condition?: string;
  developmentalChallenges?: string[];
  communicationLevel?: string;
  avatar?: string;
}): Promise<{ success: boolean; child?: ChildData; error?: string }> {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("bino_user_id") || undefined : undefined;
  const userEmail =
    typeof window !== "undefined"
      ? localStorage.getItem("bino_user_email") || undefined
      : undefined;

  try {
    const res = await saveChildProfile({
      data: {
        userId,
        userEmail,
        name: data.name,
        age: data.age,
        condition: data.condition,
        developmentalChallenges: data.developmentalChallenges,
        communicationLevel: data.communicationLevel,
        avatar: data.avatar,
      },
    });

    if (res.success && res.child) {
      // Cập nhật vào danh sách local
      const currentList = getLocalChildren().filter((c) => c.id !== res.child.id);
      currentList.unshift(res.child as ChildData);
      localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(currentList));
      setActiveChild(res.child as ChildData);
      return { success: true, child: res.child as ChildData };
    } else {
      return { success: false, error: res.error || "Không thể lưu hồ sơ trẻ." };
    }
  } catch (err: any) {
    console.error("[child-storage] saveNewChild error:", err);
    return {
      success: false,
      error: "Chưa lưu được hồ sơ vào máy chủ. Vui lòng đăng nhập và thử lại.",
    };
  }
}

export async function deleteChild(childId: string): Promise<boolean> {
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("bino_user_id") || undefined : undefined;

  try {
    const result = await deleteChildProfile({ data: { childId, userId } });
    if (!result.success) return false;
  } catch (err) {
    console.warn("[child-storage] Remote delete failed:", err);
    return false;
  }

  // Luôn xoá ở local
  const currentList = getLocalChildren().filter((c) => c.id !== childId);
  localStorage.setItem(STORAGE_CHILDREN_KEY, JSON.stringify(currentList));

  const active = getActiveChild();
  if (active?.id === childId) {
    setActiveChild(currentList.length > 0 ? currentList[0] : null);
  }

  window.dispatchEvent(new CustomEvent("bino_child_changed"));
  return true;
}
