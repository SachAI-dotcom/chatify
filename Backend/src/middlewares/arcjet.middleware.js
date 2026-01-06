import aj from "../utils/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res
          .status(429)
          .json({ message: "Rate limit exceeded. Please try again later." });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({ message: "Bot access denied." });
      } else if (decision.results.some(isSpoofedBot)) {
        return res.status(403).json({
          error: "Spoofed bot detected",
          message: "Malicious bot activity detected.",
        });
      } else {
        return res.status(403).json({
          message: "Access denied by security policy.",
        });
      }
    }
    next();
  } catch (error) {
    console.log("Arcjet Protection Error:", error);
    next();
  }
};

export default arcjetProtection;
