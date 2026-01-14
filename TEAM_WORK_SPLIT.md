# Haki Yetu - Team Work Split Document

## Overview
This document outlines how to split the codebase work between **3 team members** for pushing to the main repository.

Based on your original role definitions:
- **Person A (Mohamed)**: Users & Engagement → Auth, Lawyer Profiles, Chat, User Dashboards
- **Person B (Beatrice)**: Marketplace & Ops → Services, Booking Flow, Payments, Documents
- **Person C (Michael)**: Core & Admin → Infra, Admin Panel, Disputes, AI Features

---

## 🔵 Person A (Mohamed) - Users & Engagement

### Backend Files (`haki-yetu-b-private/`)
| Module | Files |
|--------|-------|
| **auth/** | `__init__.py`, `routes.py`, `models.py`, `services.py` |
| **lawyer/** | `__init__.py`, `routes.py`, `models.py`, `services.py` |
| **communication/** | `__init__.py`, `events.py`, `models.py`, `services.py` |
| **Root** | `socket_events.py` |

### Frontend Files (`haki-yetu-a-frontend/src/`)
| Category | Files/Folders |
|----------|---------------|
| **pages/auth/** | `Login.jsx`, `Register.jsx`, `PendingVerification.jsx`, `UserProfileSettings.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx` |
| **pages/lawyer/** | `LawyerDashboard.jsx`, `LawyerEarnings.jsx`, `LawyerRegistration.jsx`, `AvailabilitySettings.jsx`, `NotarizationQueue.jsx`, `InAppChat.jsx` |
| **pages/client/** (Chat & Profile) | `ClientDashboard.jsx`, `ClientProfileSettings.jsx`, `LawyerProfileView.jsx`, `SupportChat.jsx` |
| **components/domain/auth/** | `LoginForm.jsx`, `RegisterForm.jsx`, `LawyerRegistrationForm.jsx`, `ClientRegistrationForm.jsx` |
| **components/domain/chat/** | `ChatWindow.jsx`, `MessageBubble.jsx`, `ChatSidebar.jsx`, `ChatHeader.jsx` |
| **components/layout/** | `Navbar.jsx` |
| **context/** | `AuthContext.jsx`, `SocketContext.jsx` |
| **services/** | `auth.service.js`, `chat.service.js`, `lawyer.service.js`, `socket.service.js` |

---

## 🟢 Person B (Beatrice) - Marketplace & Ops

### Backend Files (`haki-yetu-b-private/`)
| Module | Files |
|--------|-------|
| **marketplace/** | `__init__.py`, `routes.py`, `models.py`, `services.py` |
| **documents/** | `__init__.py`, `routes.py`, `models.py`, `services.py` |
| **payments/** | `__init__.py`, `routes.py` |

### Frontend Files (`haki-yetu-a-frontend/src/`)
| Category | Files/Folders |
|----------|---------------|
| **pages/client/** (Marketplace) | `ServiceCatalog.jsx`, `ServiceDetails.jsx`, `Checkout.jsx`, `OrderHistory.jsx`, `BookingPage.jsx`, `ConsultationSuccess.jsx`, `Consultations.jsx` |
| **pages/client/** (Documents) | `DocumentGenerator.jsx`, `DocumentPartyDetails.jsx`, `MyDocuments.jsx` |
| **pages/public/** | `NotarizationFlow.jsx`, `DocumentGenerator.jsx`, `ServicesDocuments.jsx`, `ServicesProperty.jsx`, `PricingPage.jsx` |
| **components/domain/marketplace/** | `ServiceCard.jsx`, `CheckoutForm.jsx`, `OrderSummary.jsx` |
| **components/domain/documents/** | `DocumentUpload.jsx`, `DocumentPreview.jsx` |
| **services/** | `marketplace.service.js`, `mpesa.service.js`, `client.service.js` |

---

## 🟠 Person C (Michael) - Core & Admin

### Backend Files (`haki-yetu-b-private/`)
| Module | Files |
|--------|-------|
| **admin/** | `__init__.py`, `routes.py`, `models.py`, `services.py` |
| **utils/** | `__init__.py`, `decorators.py`, `validators.py`, `helpers.py`, `file_upload.py`, `constants.py` |
| **Root/Config** | `__init__.py`, `extensions.py`, `swagger_config.py`, `config.py`, `run.py` |
| **client.py** | Entire file (client-specific backend logic) |

### Frontend Files (`haki-yetu-a-frontend/src/`)
| Category | Files/Folders |
|----------|---------------|
| **pages/admin/** | `AdminDashboard.jsx`, `AdminRoutes.jsx`, `AdminSettings.jsx`, `Analytics.jsx`, `DisputeResolutionCenter.jsx`, `PendingApprovals.jsx`, `Reports.jsx`, `TemplateManagement.jsx`, `TransactionLogs.jsx`, `UserManagement.jsx`, `ViewDispute.jsx`, `ViewUser.jsx` |
| **pages/client/** (Disputes & Support) | `disputes/` folder (6 files), `support/` folder (6 files) |
| **pages/client/** (AI) | `AISummarizer.jsx` |
| **pages/public/** | `LandingPage.jsx`, `AboutPage.jsx`, `PrivacyPolicy.jsx`, `TermsOfService.jsx`, `CookiePolicy.jsx`, `AdvocateDirectory.jsx` |
| **components/layout/** | `AdminLayout.jsx`, `Footer.jsx`, `Sidebar.jsx` |
| **components/common/** | `BackButton.jsx`, `Button.jsx`, `Input.jsx`, `Modal.jsx`, `LoadingScreen.jsx`, `ScrollToTop.jsx`, `Spinner.jsx`, `ThemeToggle.jsx` |
| **components/domain/admin/** | `DataTable.jsx`, `StatusBadge.jsx` |
| **services/** | `adminService.js`, `notification.service.js` |
| **Root** | `App.jsx`, `main.jsx` |

---

## 📁 Shared Files (All Team Members)

These files are modified by everyone, so coordinate before pushing:

| Type | Files |
|------|-------|
| **Config** | `.env`, `.env.example`, `package.json`, `requirements.txt` |
| **API Base** | `services/api.js` |
| **Root** | `App.jsx` (route definitions), `index.html` |
| **Tests** | `tests/` folder (assign by module) |

---

## Git Workflow Reminder

```bash
# 1. Pull latest develop
git checkout develop
git pull origin develop

# 2. Create your feature branch
git checkout -b feat/your-module-name

# 3. Work on YOUR files only (from the list above)
# ... make changes ...
git add .
git commit -m "feat(module): description"

# 4. Push and create PR
git push origin feat/your-module-name
# Go to GitHub → Create Pull Request → Base: develop
```

---

## Summary Table

| Person | Backend Modules | Frontend Pages | Focus |
|--------|----------------|----------------|-------|
| **A (Mohamed)** | auth, lawyer, communication | auth, lawyer, chat | Users & Real-time |
| **B (Beatrice)** | marketplace, documents, payments | marketplace, documents, booking | Commerce & Files |
| **C (Michael)** | admin, utils, config | admin, disputes, public pages | Infrastructure & Admin |

---

*Document generated: 2026-01-11*
