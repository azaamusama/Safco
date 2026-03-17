# Safco Dental: Vendor Order Management Portal UX Structure

## 1. Role-Based Dashboards
**Purpose**: Provide immediate situational awareness tailored to the specific responsibilities of each user role.

### Vendor Dashboard
*   **Layout**: 4-column metric ribbon + "Urgent Actions" list + "Production Health" chart.
*   **Key Components**: 
    *   **Metric Cards**: "New Orders", "In Production", "Late/At Risk", "Shipped Today".
    *   **Action List**: "Orders Missing Tracking", "Proofs Awaiting Approval".
*   **Interaction**: Direct links from "Late" metrics to filtered table views.

### Admin Dashboard
*   **Layout**: Multi-vendor performance grid + "System Health" (JARVIS API status) + "Global Order Volume" trend.
*   **Key Components**: 
    *   **Vendor Leaderboard**: Top/Bottom performing vendors by turnaround time.
    *   **Status Funnel**: Visualizing the flow from Magento -> AS400 -> Vendor -> Shipped.
*   **Interaction**: Drill-down from vendor names to vendor-specific filtered views.

### Customer Support (CS) Dashboard
*   **Layout**: "At Risk" queue + "Turnaround Time (TAT)" tracker + "Escalation" inbox.
*   **Key Components**: 
    *   **SLA Monitor**: Countdown timers for orders approaching their ship-date deadline.
    *   **Delay Heatmap**: Identifying which product categories (e.g., custom stationery vs. bags) are experiencing delays.
*   **Interaction**: "One-click" escalation trigger to notify vendor and admin simultaneously.

---

## 2. Order Management Table
**Purpose**: The primary operational workspace for searching, filtering, and performing bulk actions on orders.

*   **Layout**: Sticky header with advanced filters + density-controlled data grid + bulk action footer.
*   **Table Structure**:
    *   **Columns**: PO Number (Magento/AS400), Vendor, SKU/Product, Quantity, Order Date, Ship Deadline, Current Status, Tracking #.
    *   **Filters**: Vendor (Admin/CS only), Status (Multi-select), Date Range (Deadline vs. Order Date), SKU Search.
*   **Interaction Design**: 
    *   **Inline Status Edit**: Change status directly in the row via dropdown.
    *   **Multi-select**: Select multiple rows to trigger "Bulk Update Status" or "Bulk Export".
    *   **Hover Preview**: Peek at the last activity log entry without leaving the table.

---

## 3. Order Detail Page
**Purpose**: Single source of truth for an individual order's lifecycle, specs, and history.

*   **Layout**: 2-column layout (Left: Specs & Files; Right: Activity Log & Status Control).
*   **Key UI Components**:
    *   **Status Stepper**: Visual progress bar (New -> In Production -> Shipped -> Completed).
    *   **Tracking Widget**: Display carrier info and link to live tracking.
    *   **Admin Overrides**: (Admin only) Ability to force-change status or re-assign vendor.
*   **Interaction Design**: Tabbed interface for "Specifications", "Files", and "Audit Trail".

---

## 4. Status Update Flow
**Purpose**: Ensure data integrity while minimizing the clicks required to advance an order.

*   **Layout**: Modal-based wizard for complex updates; Inline dropdown for simple transitions.
*   **Interaction Design**: 
    *   **Validation**: Real-time check against JARVIS API (e.g., cannot move to 'Shipped' without a tracking number).
    *   **Feedback**: Success toast confirming "Customer Notification Triggered".

---

## 5. Bulk Upload (CSV) Interface
**Purpose**: Allow vendors to update hundreds of tracking numbers or statuses in seconds.

*   **Layout**: Drag-and-drop zone + Mapping Preview + Validation Results.
*   **Key UI Components**:
    *   **Error Grid**: Highlight specific rows/cells in the CSV that failed validation (e.g., "Invalid PO Number").
    *   **Progress Bar**: Real-time feedback for large file processing.
*   **Interaction Design**: "Fix in Browser" capability to edit invalid cells directly before final submission.

---

## 6. Tracking Number Input UI
**Purpose**: Fast, error-free entry of shipping data.

*   **Layout**: Inline input within the table or a dedicated "Shipping Info" section in details.
*   **Key UI Components**:
    *   **Carrier Auto-detect**: System identifies FedEx/UPS/USPS based on tracking number format.
    *   **Scan Support**: Focus-ready input for warehouse barcode scanners.
*   **Interaction Design**: "Save & Next" button to quickly cycle through a list of orders awaiting tracking.

---

## 7. Notifications & Alerts System
**Purpose**: Proactive communication to prevent delays.

*   **Layout**: Notification center (Bell icon) + Email/SMS triggers.
*   **Alert Types**:
    *   **Critical**: "Order #123 is 24h past deadline."
    *   **Info**: "New batch of 50 orders assigned."
    *   **Success**: "Bulk upload of 200 tracking numbers completed."

---

## 8. Activity Log / Audit Trail
**Purpose**: Accountability and troubleshooting for every change made to an order.

*   **Layout**: Vertical chronological timeline.
*   **Data Points**: Timestamp, User, Action (Status Change, Note Added, File Uploaded), Source (Magento, AS400, Portal).
*   **Interaction Design**: Filter by "System Actions" vs. "User Actions".
