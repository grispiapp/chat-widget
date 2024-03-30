import { type UploadFilesResponse } from "./backend";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export interface MediaFileMeta {
    fileName: string;
    mimeType: string;
    url: string;
    size: number; // in bytes
}

export const acceptedAudioTypeMap = {
    "audio/ogg": "audio/ogg", // .oga
    "audio/mpeg": "audio/mpeg", // .mp3
    "audio/wav": "audio/wav", // .wav
    "audio/webm": "audio/webm", // .weba
};

export const acceptedFileTypeMap = {
    "application/pdf": "application/pdf",
    "application/vnd.oasis.opendocument.presentation":
        "application/vnd.oasis.opendocument.presentation", // .odp
    "application/vnd.oasis.opendocument.spreadsheet":
        "application/vnd.oasis.opendocument.spreadsheet", // .ods
    "application/vnd.oasis.opendocument.text": "application/vnd.oasis.opendocument.text", // .odt
    "application/msword": "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-powerpoint": "application/vnd.ms-powerpoint", // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
    "application/vnd.rar": "application/vnd.rar", // .rar
    "application/x-tar": "application/x-tar", // .tar
    "application/zip": "application/zip", // .zip
    "application/x-7z-compressed": "application/x-7z-compressed", // .7z
    "text/plain": "text/plain", // .txt
};

export const acceptedImageTypeMap = {
    "image/gif": "image/gif",
    "image/jpeg": "image/jpeg",
    "image/png": "image/png",
    "image/svg+xml": "image/svg+xml", // .svg
    "image/webp": "image/webp", // .webp
};

export const acceptedVideoTypeMap = {
    "video/webm": "video/webm", // .webm
    "video/mp4": "video/mp4",
    "video/mpeg": "video/mpeg",
    "video/ogg": "video/ogg", // .ogg
};

export const contentTypeMap = {
    "text/plain": "text/plain",
    // 'text/html': 'text/html',
    // 'application/json': 'application/json',
    ...acceptedAudioTypeMap,
    ...acceptedFileTypeMap,
    ...acceptedImageTypeMap,
    ...acceptedVideoTypeMap,
} as const;

export const isMediaImage = (media: UploadFilesResponse) => {
    return media.mimeType in acceptedImageTypeMap;
};

export const isMediaAudio = (media: UploadFilesResponse) => {
    return media.mimeType in acceptedAudioTypeMap;
};

export const isMediaVideo = (media: UploadFilesResponse) => {
    return media.mimeType in acceptedVideoTypeMap;
};

export const isMediaFile = (media: UploadFilesResponse) => {
    return media.mimeType in acceptedFileTypeMap;
};

export type ContentType = keyof typeof contentTypeMap;
