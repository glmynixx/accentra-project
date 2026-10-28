
const STORAGE_KEY = "accentra_shared_tasks";
const EVENT_NAME = "accentra-tasks-updated";

function isBrowser() {
    return typeof window !== "undefined";
}

function sanitizeTask(task) {
    const clean = { ...task };

    // File objects cannot be persisted in localStorage.
    // Keep attachment metadata so the UI can still display the filename.
    for (const key of ["attachment", "answerFile"]) {
        const file = clean[key];

        if (
            typeof File !== "undefined" &&
            file instanceof File
        ) {
            clean[key] = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            };
        } else if (
            typeof Blob !== "undefined" &&
            file instanceof Blob
        ) {
            clean[key] = null;
        }
    }

    return clean;
}

export function getSharedTasks(fallback = []) {
    if (!isBrowser()) return fallback;

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : fallback;
        }

        saveSharedTasks(fallback);
        return fallback;
    } catch (error) {
        console.error("Unable to load shared tasks:", error);
        return fallback;
    }
}

export function saveSharedTasks(tasks) {
    if (!isBrowser()) return;

    try {
        const safeTasks = tasks.map(sanitizeTask);

        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(safeTasks),
        );

        window.dispatchEvent(
            new CustomEvent(EVENT_NAME, {
                detail: safeTasks,
            }),
        );
    } catch (error) {
        console.error("Unable to save shared tasks:", error);
    }
}

export function subscribeToSharedTasks(callback) {
    if (!isBrowser()) return () => {};

    const handleUpdate = (event) => {
        callback(event.detail ?? getSharedTasks());
    };

    const handleStorage = (event) => {
        if (event.key === STORAGE_KEY) {
            callback(getSharedTasks());
        }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
        window.removeEventListener(EVENT_NAME, handleUpdate);
        window.removeEventListener("storage", handleStorage);
    };
}
