# Safco Dental: Vendor Management Portal UX Structure

## 1. Vendor Dashboard
**Purpose**: Provide an at-a-glance overview of production health, urgent deadlines, and recent communications.
*   **Layout Sections**:
    *   **Header**: Welcome message, quick search, and notification bell.
    *   **Stat Row**: High-level metrics (Active Orders, Pending Proofs, Late Orders, Unread Messages).
    *   **Urgent Action Center**: A list of orders requiring immediate attention (e.g., "Proof Approval Needed", "Shipment Overdue").
    *   **Production Timeline**: A visual calendar or Gantt-style view of upcoming deadlines.
*   **Key UI Components**:
    *   **Metric Cards**: Large numbers with trend indicators.
    *   **Actionable Alerts**: High-contrast banners for critical delays.
*   **Tables/Charts**:
    *   **Order Status Distribution**: A donut chart showing % of orders in "Pre-press", "Production", "QC", and "Shipped".
    *   **Deadline Calendar**: A mini-calendar highlighting delivery dates.
*   **Interaction Design**: "One-click" navigation from dashboard alerts directly to the relevant Order Detail page.

## 2. Order Management Page
**Purpose**: A centralized, filterable list of all orders assigned to the vendor.
*   **Layout Sections**:
    *   **Filter Bar**: Tabs for "All", "Active", "Completed", and "Cancelled". Advanced filters for Date Range, Product Category, and Status.
    *   **Data Grid**: The primary list of orders.
*   **Key UI Components**:
    *   **Status Badges**: Color-coded pills (e.g., Green for Shipped, Yellow for Production, Red for Late).
    *   **Search Input**: Real-time search by PO Number or Product Name.
*   **Tables/Charts**:
    *   **Order Table**: Columns for PO#, Product, Quantity, Start Date, Deadline, Current Status, and Last Update.
*   **Interaction Design**: Row-level hover actions for "Quick Update" or "Download Specs". Clicking a row opens the full Order Detail.

## 3. Order Detail Page
**Purpose**: Deep-dive into a single order, containing all specifications, files, and history.
*   **Layout Sections**:
    *   **Order Header**: PO# and Status prominently displayed with a "Primary Action" button (e.g., "Update Status").
    *   **Spec Grid**: Two-column layout for product specs (Material, Ink, Finish, Dimensions).
    *   **File Repository**: Section for production art, proofs, and shipping labels.
    *   **Activity Timeline**: A vertical audit trail of every status change and comment.
*   **Key UI Components**:
    *   **Progress Stepper**: A horizontal bar showing the order's journey from "Received" to "Delivered".
    *   **Comment Box**: Integrated chat-style interface for communicating with Safco Ops.
*   **Interaction Design**: Tabbed navigation within the page to switch between "Details", "Files", and "Communication".

## 4. Status Update Flow
**Purpose**: A streamlined process for vendors to report production progress.
*   **Layout Sections**:
    *   **Modal Overlay**: Triggered from the Dashboard or Order Detail.
    *   **Step 1: Status Selection**: Dropdown of valid next states.
    *   **Step 2: Supporting Info**: Conditional fields (e.g., if status is "Shipped", show "Tracking Number" and "Carrier").
    *   **Step 3: Confirmation**: Summary of changes.
*   **Key UI Components**:
    *   **Dropdown Select**: With descriptive helper text for each status.
    *   **Date Picker**: For estimated completion dates.
*   **Interaction Design**: "Smart Defaults"—if an order is in "Production", the next logical status "QC" is pre-selected.

## 5. File Upload Interface
**Purpose**: Securely exchange large production files and shipping documents.
*   **Layout Sections**:
    *   **Drop Zone**: Large, dashed-border area for drag-and-drop.
    *   **Upload Queue**: List of files currently being processed with progress bars.
    *   **File Categorization**: Radio buttons to tag file as "Final Art", "Proof", or "Packing Slip".
*   **Key UI Components**:
    *   **Progress Bars**: Real-time visual feedback for large file transfers.
    *   **Thumbnail Previews**: For image and PDF files.
*   **Interaction Design**: Drag-and-drop support with immediate validation (file type/size checks).

## 6. Notifications and Alerts
**Purpose**: Keep vendors informed of changes without requiring constant portal monitoring.
*   **Layout Sections**:
    *   **Notification Center**: A slide-out panel or dedicated page.
    *   **Email Templates**: Standardized formats for "New Order Assigned" or "Proof Rejected".
*   **Key UI Components**:
    *   **Unread Indicators**: Red dots on the bell icon.
    *   **Toast Notifications**: Brief, non-intrusive popups for real-time updates while in the portal.
*   **Interaction Design**: "Mark all as read" and granular notification settings (toggle Email vs. In-App).

## 7. Vendor Profile Settings
**Purpose**: Manage company information, contact points, and security.
*   **Layout Sections**:
    *   **Company Info**: Address, Tax ID, and Primary Contact.
    *   **User Management**: Add/Remove team members who can access the portal.
    *   **Security**: Password reset and MFA configuration.
*   **Key UI Components**:
    *   **Form Groups**: Organized by category with clear labels.
    *   **Toggle Switches**: For enabling/disabling security features.
*   **Interaction Design**: "Auto-save" for minor settings; "Save Changes" button with confirmation for sensitive data.
