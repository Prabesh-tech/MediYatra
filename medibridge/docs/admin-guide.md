# MediBridge Admin Guide

## Access

Admin access is role-checked by the API. Patient registration always creates the `PATIENT` role; there is no public role selection. Create and assign coordinator, hospital-admin, and super-admin accounts only through a reviewed operator process. Do not share admin credentials.

## Inquiry pipeline

1. Sign in with an authorized coordinator or super-admin account.
2. Open `/en/admin` and search by patient name, email, or inquiry reference.
3. Review status, destination preference, assignment, and document count in the list.
4. Open an inquiry only when required for coordination. The detail view records an audit event and decrypts medical narrative for that authorized request.
5. Update the pipeline status. Closing or marking an inquiry treated releases coordinator capacity.
6. Export only the current filtered page when required. Keep exports in approved, access-controlled storage and delete them when no longer needed.

## Provider and review handling

Public hospital and doctor listings remain empty until verified records are published. Do not claim JCI/NABH accreditation without checking the issuing body and validity dates. Reviews require moderation; publish only content with permission and remove identifying health details unless the patient has explicitly consented.

Catalog publishing and complete CMS editing are not implemented yet. Do not edit production records directly without a reviewed migration and audit process.

## Patient data requests

Export and deletion requests are recorded for follow-up; automated fulfillment is not implemented yet. Verify the requester, follow the approved retention policy, document the action, and preserve legally required audit records. Do not mark a request complete until the data action has been independently checked.

## Privacy and incident handling

- Never paste medical details into chat, issue trackers, or logs.
- Use the private upload flow; signed URLs expire quickly.
- Do not send health records by ordinary email or messaging apps.
- Escalate suspected account or document exposure through the organization’s incident process.
- The included legal pages are drafts and are not a substitute for approved privacy, security, and medical compliance policies.
