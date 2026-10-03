import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";
import { TextDecoder } from "node:util";
import type { RequestHandler } from "express";
import multer from "multer";

type UploadField = "covidTest" | "poster";

const uploadRules: Record<UploadField, { maxBytes: number; mimeTypes: Record<string, string> }> = {
  covidTest: {
    maxBytes: 1024 * 1024,
    mimeTypes: { ".txt": "text/plain" },
  },
  poster: {
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".jfif": "image/jpeg",
      ".png": "image/png",
    },
  },
};

function hasValidContents(field: UploadField, content: Buffer): boolean {
  if (content.length === 0) {
    return false;
  }

  if (field === "poster") {
    const isJpeg = content.length >= 3 && content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
    const isPng = content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    return isJpeg || isPng;
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(content);
    return !text.includes("\0");
  } catch {
    return false;
  }
}

export function createFileUploadMiddleware(field: UploadField, destination = "uploads"): RequestHandler {
  const rules = uploadRules[field];
  const uploadRoot = resolve("uploads");
  const resolvedDestination = resolve(uploadRoot, destination);
  const destinationRelative = relative(uploadRoot, resolvedDestination);
  if (destinationRelative.startsWith("..") || destinationRelative.includes(`..${sep}`)) {
    throw new Error("Invalid upload destination");
  }

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_req, _file, callback) => callback(null, resolvedDestination),
      filename: (_req, file, callback) => {
        callback(null, `${field}_${randomUUID()}${extname(file.originalname).toLowerCase()}`);
      },
    }),
    limits: { fileSize: rules.maxBytes, files: 1 },
    fileFilter: (_req, file, callback) => {
      const extension = extname(file.originalname).toLowerCase();
      if (rules.mimeTypes[extension] !== file.mimetype) {
        callback(new Error("Unsupported file type"));
        return;
      }
      callback(null, true);
    },
  }).single(field);

  return (req, res, next) => {
    upload(req, res, async (error) => {
      if (error) {
        const tooLarge = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
        res.status(tooLarge ? 413 : 400).json({
          message: tooLarge ? "Uploaded file exceeds the size limit" : "Invalid file upload",
        });
        return;
      }

      if (!req.file) {
        next();
        return;
      }

      try {
        const resolvedUploadedPath = resolve(req.file.path);
        const uploadedRelative = relative(uploadRoot, resolvedUploadedPath);
        if (uploadedRelative.startsWith("..") || uploadedRelative.includes(`..${sep}`)) {
          res.status(400).json({ message: "Invalid file upload" });
          return;
        }

        const content = await fs.readFile(resolvedUploadedPath);
        if (!hasValidContents(field, content)) {
          await fs.unlink(resolvedUploadedPath);
          res.status(400).json({ message: "Uploaded file content is invalid" });
          return;
        }
        next();
      } catch (validationError) {
        next(validationError);
      }
    });
  };
}

export const covidTestUpload = createFileUploadMiddleware("covidTest");
export const posterUpload = createFileUploadMiddleware("poster");