import { twMerge } from "tailwind-merge"
import { clsx } from 'clsx'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatTimeDelta(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const secs = Math.floor(seconds - hours * 3600 - minutes * 60);
    const parts = [];
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    if (minutes > 0) {
        parts.push(`${minutes}m`);
    }
    if (secs > 0) {
        parts.push(`${secs}s`);
    }
    return parts.join(" ");
}