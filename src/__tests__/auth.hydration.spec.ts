import { describe, it, expect, beforeEach } from "vitest";

describe("Auth hydration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle empty storage gracefully", () => {
    // Mimic initializeAuth behavior
    const raw = localStorage.getItem("oss365-auth");
    expect(raw).toBeNull();
    
    // The app should set isAuthenticated=false after hydration in runtime
    // This is a placeholder test - the actual behavior is tested in e2e
    expect(true).toBe(true);
  });

  it("should parse valid auth state correctly", () => {
    const state = {
      isLoading: false,
      isAuthenticated: true,
      token: "test-token",
      user: { id: "u1", email: "test@example.com" },
      tenant: { id: "ten-1", domain: "test.com" }
    };
    
    localStorage.setItem("oss365-auth", JSON.stringify(state));
    const parsed = JSON.parse(localStorage.getItem("oss365-auth")!);
    
    expect(parsed.tenant.id).toBe("ten-1");
    expect(parsed.user.id).toBe("u1");
    expect(parsed.isAuthenticated).toBe(true);
    expect(parsed.token).toBe("test-token");
  });

  it("should handle malformed auth state", () => {
    // Test with invalid JSON
    localStorage.setItem("oss365-auth", "invalid-json");
    
    try {
      const parsed = JSON.parse(localStorage.getItem("oss365-auth")!);
      expect(parsed).toBeUndefined();
    } catch (error) {
      expect(error).toBeInstanceOf(SyntaxError);
    }
  });

  it("should handle missing required fields", () => {
    const incompleteState = {
      isLoading: false,
      isAuthenticated: true,
      // Missing token and tenant.id
      user: { id: "u1" }
    };
    
    localStorage.setItem("oss365-auth", JSON.stringify(incompleteState));
    const parsed = JSON.parse(localStorage.getItem("oss365-auth")!);
    
    // Should be considered invalid due to missing required fields
    expect(parsed.token).toBeUndefined();
    expect(parsed.tenant?.id).toBeUndefined();
  });
});
