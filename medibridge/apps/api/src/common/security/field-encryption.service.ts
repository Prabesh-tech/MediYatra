import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FieldEncryptionService {
  constructor(private readonly config: ConfigService) {}

  encrypt(plaintext: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.encryptionKey(), iv);
    const ciphertext = Buffer.concat([
      cipher.update(plaintext, "utf8"),
      cipher.final(),
    ]);
    return [
      "v1",
      iv.toString("base64url"),
      cipher.getAuthTag().toString("base64url"),
      ciphertext.toString("base64url"),
    ].join(".");
  }

  decrypt(value: string): string {
    const [version, encodedIv, encodedTag, encodedCiphertext, extra] = value.split(".");
    if (version !== "v1" || !encodedIv || !encodedTag || encodedCiphertext === undefined || extra) {
      throw new InternalServerErrorException("Encrypted field format is invalid");
    }

    try {
      const decipher = createDecipheriv(
        "aes-256-gcm",
        this.encryptionKey(),
        Buffer.from(encodedIv, "base64url"),
      );
      decipher.setAuthTag(Buffer.from(encodedTag, "base64url"));
      return Buffer.concat([
        decipher.update(Buffer.from(encodedCiphertext, "base64url")),
        decipher.final(),
      ]).toString("utf8");
    } catch {
      throw new InternalServerErrorException("Encrypted field could not be decrypted");
    }
  }

  private encryptionKey(): Buffer {
    const encodedKey = this.config.get<string>("PII_ENCRYPTION_KEY");
    if (!encodedKey || !/^[\da-f]{64}$/i.test(encodedKey)) {
      throw new ServiceUnavailableException("Field encryption is not configured");
    }
    return Buffer.from(encodedKey, "hex");
  }
}
