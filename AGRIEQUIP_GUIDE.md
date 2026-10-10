# AgriEquip PH prototype

The connected prototype has two modules: **Web for the admin** and **Mobile for the farmer**. Web has no equipment booking or rental creation features.

## Run the app

In VS Code, open `C:\Users\lance\agriequip-ph`, then run:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL shown in the terminal. The top Web / Mobile switch keeps both modules connected during the presentation.

## Sign in to Web and Mobile

Web opens the **Admin login**. Mobile opens the **Farmer login**, entirely inside the phone frame. The view switch remains available before and after sign-in.

| View | Account | Password |
| --- | --- | --- |
| Web / Admin | `admin@agriequip.ph` | `Admin123!` |
| Mobile / Farmer | `09123456789` | `Farmer123!` |

For a quick presentation, expand **Presentation account**, click **Fill account details**, then click **Sign in**. Each form validates missing and incorrect credentials and has a Show / Hide password button. English and Filipino are supported.

The roles have separate browser-local sessions that survive refresh. Admin signs out from the Web top bar. Farmer signs out from Mobile → Profile → Account. Signing out preserves profiles, equipment, and rental records and does not sign out the other role. These fixed accounts are a frontend simulation; they do not provide secure authentication or isolate different farmers' records. Passwords are not saved in browser storage, but the sample credentials are part of the public frontend code.

## Admin web dashboard

- **Dashboard:** pending requests, requests awaiting farmer confirmation, bookings ready for pickup, active rentals, recent requests, and completed rental estimates.
- **Rental Requests:** search and filter requests submitted on mobile; review the farmer, equipment owner, dates, pickup method, and estimate; approve or reject pending requests.
- **Transactions:** track confirmed bookings, active rentals, completed returns, and cancellations. These are rental records, not payment transactions.
- **Equipment Management:** add and edit equipment names, categories, owners/cooperatives, locations, descriptions, specifications, daily rates, delivery fees, and maintenance availability. Upload JPG, PNG, or WebP photos up to 1 MB. Changes update the farmer mobile catalog automatically within this browser. Equipment photos also appear in rental tables and the review dialog.
- **Review controls:** record pickup after farmer confirmation, then record return to complete an active rental.

There is one fixed presentation Admin account. The web view has no farmer/owner role switch, equipment catalog for renters, booking form, or farmer confirmation controls.

## Farmer mobile module

Home, Equipment, My Rentals, Settings, and Profile appear inside the phone frame. The content area scrolls independently between the header and bottom navigation so the tabs do not cover it. Smaller images, cards, icons, and a shared text scale keep the layout compact.

Farmers start with 17 fictional listings in six categories, search and filter equipment, read details, choose rental dates and duration, check availability, choose pickup or delivery, review an itemized estimate, and submit a request. Admin-added listings also appear here. Settings contains demo information and a rental guide. Profile contains editable farmer information and the shared rental summary.

**Profile:** edit and save the farmer's full name, Philippine mobile number, barangay, and farm location. Complete these fields before submitting a new rental. Use fictional details during the presentation. The sample Farmer account uses one shared browser-local profile. Editing its contact number does not change the fixed presentation login number.

**Delivery:** owner delivery requires an address and preferred delivery time on the start date. The address starts with the saved farm location; it can be changed for each request. Landmark and rental notes are optional. Self pickup does not require delivery details. Review these details before submission; they appear in Mobile rental details and Admin review.

New requests save the submitted farmer information, delivery details, equipment details, photo, and agreed rate. Later edits to the profile or listing do not rewrite these requests. Current maintenance status and reservations are still checked during approval and confirmation. Older saved requests remain readable and identify contact/delivery information that was not previously recorded.

All 17 mobile listings now use realistic AI-generated demo images, with distinct photos for each tool or machine. The Home banner uses a generated farm landscape. Optimized local JPEG files are in `public/images/equipment-v2/`, with the banner at `public/images/farm-banner-v2.jpg`. The photo component preserves the full subject without stretching it. Exact prompts and saved paths are recorded in `AgriEquip-Image-Notes.md` beside this guide.

## Presentation walkthrough

1. Select Mobile and sign in with the Farmer presentation account. Open Profile and save fictional farmer information. Then select Equipment and choose an available listing.
2. Choose rental dates and duration, check availability, and select pickup or delivery. For delivery, enter the address and preferred time. Review and submit.
3. Select Web and sign in with the Admin presentation account. Open Rental Requests, review the new Pending request, and approve it as Admin.
4. Return to Mobile → My Rentals. Review the Approved request and confirm the booking as Farmer.
5. Return to Web and review the Confirmed record. Enter the receiving person, equipment condition, and accessories. Confirm the inspection and safety briefing, then confirm pickup. Its status becomes Active.
6. Enter the return inspection and any damage or missing-item notes, then confirm return. The record becomes Completed and appears in Mobile → My Rentals → Previous.

Flow: **Pending → Approved → Confirmed → Active → Completed**. Admins reject pending requests. Farmers can cancel before pickup. Rejected and Cancelled records remain available for reference.

## Dates, availability, and estimates

Both dates count; a same-day rental is one calendar day. Past start dates and end dates before the start are rejected. Duration presets update the end date. Approved, Confirmed, and Active rentals reserve dates. Validation checks availability before request review, submission, approval, and farmer confirmation. Conflicting approval is blocked. Pending requests do not reserve dates.

Rates, owners, equipment specifications, and availability are fictional demo data. Delivery is one estimate per rental. Fuel and services not listed are excluded. No payment is collected or marked as paid. Completed rental estimates are not revenue.

## Files to edit

All source paths are inside `C:\Users\lance\agriequip-ph`.

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Select the admin web or farmer mobile module |
| `src/components/auth/LoginPage.tsx` | Admin and Farmer login forms, account helper, and validation |
| `src/components/auth/AuthGate.tsx` | Show the login until its role has a local session |
| `src/components/auth/SignOutButton.tsx` | Sign out without removing rental or profile records |
| `src/lib/sessionStore.ts` | Fixed presentation accounts and separate role sessions |
| `src/Login.css` | Web and phone login layouts |
| `src/components/admin/AdminDashboard.tsx` | Admin navigation, summaries, filters, review, and status actions |
| `src/components/admin/AdminRentalTable.tsx` | Admin rental records table |
| `src/Admin.css` | Admin-specific visual styles |
| `src/components/mobile/FarmerMobile.tsx` | Farmer navigation and rental screens |
| `src/components/mobile/FarmerAccountScreens.tsx` | Demo Settings and Profile |
| `src/Mobile.css` | Compact typography, spacing, cards, and scroll layout |
| `src/components/RentalForm.tsx` | Farmer dates, duration, availability, and price review |
| `src/components/Presentation.tsx` | Top view switch and phone preview |
| `src/Presentation.css` | Phone frame and showcase layout |
| `src/data/equipment.ts` | Fictional equipment catalog |
| `src/lib/workflow.ts` | Request validation and role-specific status transitions |
| `src/lib/rentalStore.ts` | Browser storage synchronization |
| `src/lib/rentals.ts` | Calendar arithmetic and stored data validation |
| `src/components/admin/EquipmentManagement.tsx` | Admin listing editor and image upload |
| `src/components/RentalContactDetails.tsx` | Shared farmer and delivery summary |
| `src/lib/profileStore.ts` | Farmer profile persistence and validation |
| `src/lib/equipmentStore.ts` | Shared editable catalog and equipment snapshots |
| `src/lib/browserStore.ts` | Reusable browser storage synchronization |

## Prototype boundaries

This is a **single-browser simulation** using localStorage. Web and Mobile share records automatically within one origin, and requests survive refresh. Existing saved rental requests are preserved. Clearing browser storage removes them. Separate browsers and devices do not share data. Simultaneous writes are not transaction-safe.

Admin and Farmer now have role-specific presentation login screens. The login gates are frontend simulations, not secure authentication: users can modify local browser sessions. A backend is still needed for real registration, password hashing, server-validated sessions and permissions, per-user records, account recovery, atomic availability checks, notifications, transaction auditing, payments, and cross-device synchronization.

Profiles, catalog edits, owner records, uploaded photos, notification read state, history, checks, and language preference are local to this browser. Clearing browser storage removes them. Listings represent one rentable unit each. Equipment and owner records can be added or edited; removal is not included.

## Validation

Login checks passed for empty and incorrect credentials, password visibility, Enter submission, account helpers, separate Admin/Farmer sessions, refresh persistence, cross-tab sign-out, preserved rental records, and English/Filipino labels and errors. Web and phone login layouts were checked at 1440, 1366, 390, and 320 px widths for horizontal overflow and footer overlap. The owner, notification, approval, farmer confirmation, pickup, return, and status-history checks also passed after signing in through both screens. See `AgriEquip-Login-Verification.json`.

Production build and lint passed. Isolated browser checks verified mobile submission, invalid dates, estimates, admin approval and rejection, conflicting approval, farmer confirmation, pickup, return, filters, role-specific transitions, refresh persistence, and automatic synchronization. Home, Equipment, My Rentals, Settings, Profile, details, dates, review, and rental records were checked at four presentation sizes for horizontal overflow and navigation overlap. Browser checks use isolated demo storage so test records do not populate the user's regular browser.

The new profile, delivery, and catalog features were checked for required fields, mobile-number validation, delivery review and estimates, image upload and invalid file rejection, maintenance blocking, catalog synchronization, custom listing rentals, preservation of request snapshots, refresh persistence, legacy records, and responsive form/editor layouts. See `AgriEquip-Profile-Equipment-Verification.json` for the focused checks.

## Owners, notifications, rental checks, and language

**Owners & Cooperatives (Web):** add and edit owner records with a contact person, Philippine mobile number, location, and notes. Assign a listing to a record in Equipment Management. Renaming a record keeps its equipment assignments. Initial contact fields are blank; enter fictional details for the presentation. Current owner contacts appear in mobile equipment details.

**Notifications (Web and Mobile):** the bell opens a list of rental activity and due/overdue reminders linked to each rental. Mark one or all as read, or filter unread items. Farmer notifications cover submission, approval, rejection, confirmation, pickup, return, and cancellation. Admin notifications cover new requests, farmer confirmation/cancellation, and reminders. Read state is separate for each role and survives refresh. Notifications remain within the app; email, SMS, and push delivery are not connected. Reminders are checked when the app opens and every minute while open.

**Reasons and history:** rejecting or cancelling requires a reason. Admins may add a note when approving or rejecting. Web and Mobile show the timestamp, acting role, reason, and note for each recorded status change. Existing rentals keep their known submission time; older changes without timestamps are explicitly marked as not recorded.

**Pickup and return:** pickup requires a receiving person, condition, accessories, inspection, and safety briefing. Return requires a receiving person, condition, accessories, and inspection. Damage or missing accessories require explanatory notes. Both check records remain in rental history. Active rentals due today, tomorrow, or overdue show reminders. If an inspection finds damage, set maintenance availability in Equipment Management before renting again. The prototype does not automatically create repairs or charges.

**Language:** choose English or Filipino in Mobile → Settings or the admin top bar. The choice applies to both modules, survives refresh, and updates interface labels, statuses, and form instructions. Stored status/category values stay unchanged. Equipment descriptions and entered names, addresses, reasons, and notes remain as written. Visible "Demo" wording remains removed from both modules.

| File | Purpose |
| --- | --- |
| `src/components/admin/OwnerRecords.tsx` | Owner records and editor |
| `src/lib/ownerStore.ts` | Owner persistence and stable equipment assignments |
| `src/components/NotificationList.tsx` | Notification list and read controls |
| `src/lib/notifications.ts` | Activity notifications, reminders, and read state |
| `src/components/admin/RentalActions.tsx` | Required reasons and pickup/return forms |
| `src/components/RentalHistory.tsx` | Status history and inspection summaries |
| `src/lib/rentalActivity.ts` | Legacy history and inspection validation |
| `src/lib/language.ts` | Shared language preference and translation helpers |
| `src/data/filipino.ts` | Filipino interface translations |
| `src/Activity.css` | Owner, notification, history, and inspection layouts |

Focused checks cover owner validation/assignment/renaming, contact synchronization, notifications/read controls, required reasons, status history, pickup and safety checks, return damage notes, overdue reminders, language switching and persistence, and compact layouts. Results are in `AgriEquip-Operations-Verification.json`.
