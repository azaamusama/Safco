# Safco Dental Internal Web Portal: SSO & RBAC Design

## 1. Recommended SSO Architecture Options

### Option A: Microsoft Entra ID (formerly Azure AD)
*   **Protocol**: OIDC (OpenID Connect) for React/Modern Apps, SAML for legacy integrations.
*   **Pros**:
    *   Native integration with Safco’s existing Microsoft 365 ecosystem.
    *   Seamless "Windows Hello" and Desktop SSO experience for employees.
    *   Robust Conditional Access policies (MFA, IP fencing).
*   **Cons**:
    *   External vendor management (B2B) can be complex/costly if not configured correctly.
    *   UI customization for the login page is somewhat limited compared to Okta.
*   **When to Choose**: If Safco already uses Microsoft 365 for email/identity and wants to minimize additional licensing costs.
*   **Assumptions**: Safco has an existing Azure tenant and IT staff familiar with Entra ID.

### Option B: Okta Workforce Identity
*   **Protocol**: OIDC / SAML.
*   **Pros**:
    *   Best-in-class developer experience and documentation.
    *   Superior "Universal Directory" for managing both internal employees and external vendors in one place.
    *   Highly customizable "Sign-In Widget" for a branded Safco experience.
*   **Cons**:
    *   Higher licensing costs (per user/month).
    *   Another "Identity Island" to manage if Safco is already heavily invested in Microsoft.
*   **When to Choose**: If Safco requires a neutral identity provider that handles complex multi-org or vendor scenarios with high ease of use.
*   **Assumptions**: Budget is available for a premium identity solution.

---

## 2. Auth Flow Diagrams

### Employee Login Flow (SSO)
1.  **User** navigates to `portal.safcodental.com`.
2.  **React Portal** detects no session and redirects to **IdP Login Page** (Entra/Okta).
3.  **User** enters Safco email; IdP performs SSO (or prompts for password + MFA).
4.  **IdP** redirects back to Portal with an **Authorization Code**.
5.  **React Portal** exchanges code for **ID Token** (user info) and **Access Token** (API access).
6.  **React Portal** stores tokens in secure memory/session storage.

### External Vendor Login Flow
1.  **Vendor** navigates to `portal.safcodental.com/vendor`.
2.  **React Portal** redirects to a specific **Vendor Login Policy** in the IdP.
3.  **Vendor** authenticates via their own credentials (or social/federated login).
4.  **IdP** issues tokens with a specific `scope` (e.g., `vendor_access`).
5.  **React Portal** restricts UI to only show the "Vendor Portal" module.

### Token/Session Flow (React → JARVIS → Backend)
1.  **React Portal** sends `Authorization: Bearer <Access_Token>` in every request to **JARVIS API**.
2.  **JARVIS API** (Node/Python) validates the token signature (JWT) and checks expiration.
3.  **JARVIS** extracts `roles` or `groups` from the token claims.
4.  **JARVIS** proxies requests to **AS400** (via service account/VPN) or **Magento** (via API keys), using the user's identity for auditing.
5.  **Refresh Token**: When the Access Token expires (e.g., 1 hour), React uses the **Refresh Token** to get a new one silently in the background.

### Logout Flow
1.  **User** clicks "Logout".
2.  **React Portal** clears local tokens and calls the **IdP Revocation Endpoint**.
3.  **React Portal** redirects to **IdP Logout URL** to clear the global SSO session (Single Logout).
4.  **User** is returned to the Safco Login screen.

---

## 3. Role-Based Access Control (RBAC) Model

### Role Mapping
| Role | Accessible Modules | Permissions |
| :--- | :--- | :--- |
| **Inventory Planner** | Forecast IQ, File Upload | Read/Write Forecasts, Upload Inventory Data |
| **Customer Support** | Marketplace Tools, Magento Admin | View Orders, Manage Returns |
| **Merchandising** | Marketplace Tools, File Upload | Manage Product Listings |
| **Finance** | Finance Dashboard, AS400 Reports | View Invoices, Audit Logs |
| **Vendor** | Vendor Portal | View assigned POs, Update Lead Times |
| **Admin** | All Modules + Admin Panel | User Management, Role Assignment |

### Role Assignment Mechanism
*   **Source of Truth**: IdP Groups (e.g., an AD Group named `Safco_Inventory_Planners`).
*   **Token Claims**: The Access Token contains a `roles` array.
*   **Internal DB (Optional)**: For fine-grained permissions (e.g., "Planner for Category X only"), JARVIS queries an internal SQL table using the `sub` (User ID) from the token.

---

## 4. UX Requirements

### Login Experience
*   **Branding**: Safco Dental logo, clean background.
*   **Buttons**: "Sign in with Safco Account" (Primary) and "Vendor Login" (Secondary).
*   **First-Time User**: If a user logs in but has no assigned groups, show a "Access Pending" screen with a "Request Access" button that triggers a workflow to their manager.

### Error States
*   **Invalid Account**: "Your account is not recognized. Please contact IT."
*   **Expired Session**: A toast notification: "Your session has expired. Please sign in again to continue."
*   **Blocked Module**: If a user tries to deep-link to a module they don't have, show a "Module Restricted" graphic with a list of who to contact for access.

### Admin Features
*   **Impersonation**: Admins can "View as User" to troubleshoot issues. UI shows a persistent "Impersonating: [User Name]" banner with an "End Session" button.

---

## 5. Security & Compliance Checklist
*   **MFA**: Mandatory for all employees; optional/risk-based for vendors.
*   **Least Privilege**: Users only see modules they are explicitly assigned to.
*   **Audit Logs**: JARVIS logs every API call with `timestamp`, `user_id`, `action`, and `ip_address`.
*   **Session Timeouts**: 8 hours for internal employees; 2 hours for vendors.
*   **Vendor Isolation**: Database queries in JARVIS must always include a `vendor_id` filter derived from the token.

---

## 6. Deliverables for Product/Design

### User Stories
*   "As an Inventory Planner, I want to sign in once so I can access Forecast IQ and File Upload without re-entering my password."
*   "As a Manager, I want to assign a new hire to the 'Merchandising' group in the IdP so they automatically get portal access."

### Key Screens
1.  **Login Screen** (SSO Entry).
2.  **App Launcher / Home** (Grid of allowed modules).
3.  **Access Denied / Request Access** (For unauthorized modules).
4.  **User Profile / Session Info** (Showing current roles).

### Analytics Events
*   `login_success` / `login_failure` (with error code).
*   `module_access_denied` (SKU/Module ID).
*   `session_expired_auto_logout`.
*   `role_mismatch_detected` (Token role vs. requested resource).
