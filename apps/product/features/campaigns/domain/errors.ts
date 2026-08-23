/** Raised when a domain invariant is violated (independent of transport). */
export class CampaignValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CampaignValidationError";
  }
}
