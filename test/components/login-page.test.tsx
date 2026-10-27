import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push, replace: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

import LoginPage from "@/app/(auth)/login/page"

const LOGIN_URL = "https://api.bunyodoptum.uz/api/v1/admin/login".replace(
  "bunyodoptum",
  "bunyodoptom"
)

function jsonResponse(body: unknown, ok = true) {
  return { ok, json: async () => body } as Response
}

async function fillAndSubmit(username = "admin01", password = "secret123") {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText("Username"), username)
  await user.type(screen.getByLabelText("Password"), password)
  await user.click(screen.getByRole("button", { name: "Login" }))
}

describe("LoginPage", () => {
  beforeEach(() => {
    push.mockClear()
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it("renders the login form", () => {
    render(<LoginPage />)

    expect(screen.getByText("Login to your account")).toBeInTheDocument()
    expect(screen.getByLabelText("Username")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
  })

  it("blocks submission and shows validation errors for short input", async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    render(<LoginPage />)
    await fillAndSubmit("ab", "123")

    expect(
      await screen.findByText("Username must be at least 4 characters")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it("posts credentials, stores the session and redirects home", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({
        data: { token: "jwt-token", user: { id: 1, name: "Admin", role: "admin" } },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    render(<LoginPage />)
    await fillAndSubmit("admin01", "secret123")

    await waitFor(() => expect(push).toHaveBeenCalledWith("/"))

    expect(fetchMock).toHaveBeenCalledWith(
      LOGIN_URL,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ phone: "admin01", password: "secret123" }),
      })
    )
    expect(localStorage.getItem("token")).toBe("jwt-token")
    expect(JSON.parse(localStorage.getItem("user")!)).toMatchObject({ id: 1 })
  })

  it("shows the backend error message on rejection", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ message: "Login yoki parol xato" }, false))
    )

    render(<LoginPage />)
    await fillAndSubmit()

    expect(await screen.findByText("Login yoki parol xato")).toBeInTheDocument()
    expect(localStorage.getItem("token")).toBeNull()
    expect(push).not.toHaveBeenCalled()
  })

  it("falls back to a generic message when the error body is empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({}, false))
    )

    render(<LoginPage />)
    await fillAndSubmit()

    expect(await screen.findByText("Login failed")).toBeInTheDocument()
  })

  it("rejects a successful response that carries no token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => jsonResponse({ data: { user: { id: 1 } } }))
    )

    render(<LoginPage />)
    await fillAndSubmit()

    expect(
      await screen.findByText("Login succeeded but no token was returned")
    ).toBeInTheDocument()
    expect(localStorage.getItem("token")).toBeNull()
    expect(push).not.toHaveBeenCalled()
  })

  it("disables the form while the request is in flight", async () => {
    let resolveFetch: (value: Response) => void = () => {}
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve
          })
      )
    )

    render(<LoginPage />)
    await fillAndSubmit()

    expect(await screen.findByText("Logging in...")).toBeInTheDocument()
    expect(screen.getByLabelText("Username")).toBeDisabled()

    const user = userEvent.setup()
    resolveFetch(
      jsonResponse({ data: { token: "t", user: { id: 1 } } })
    )
    await waitFor(() => expect(push).toHaveBeenCalled())
    expect(user).toBeDefined()
  })

  it("survives a network failure with a readable error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("Network down")
      })
    )

    render(<LoginPage />)
    await fillAndSubmit()

    expect(await screen.findByText("Network down")).toBeInTheDocument()
  })
})
