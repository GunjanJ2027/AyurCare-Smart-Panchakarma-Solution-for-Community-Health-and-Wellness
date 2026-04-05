// frontend/src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_title": "AyurCare",
      "admin_portal": "Admin Portal",
      "platform_overview": "Platform Overview",
      "completed_sessions": "Completed Sessions",
      "ngo_impact": "NGO Impact Metrics",
      "pharmacy_stock": "Pharmacy Inventory",
      "secure_logout": "Secure Logout",
      "command_center": "Community Health Command Center",
      // NEW: Practitioner Dashboard Vocabulary
      "practitioner": "Practitioner",
      "clinic_schedule": "Clinic Schedule",
      "patient_directory": "Patient Directory",
      "completed_therapies": "Completed Therapies",
      "treatment_command": "Treatment Command Center",
      "prof_portal": "AyurCare Professional Portal",
      "needs_approval": "Needs Approval",
      "upcoming_today": "Upcoming Today",
      "therapies_done": "Therapies Completed"
    }
  },
  hi: {
    translation: {
      "app_title": "आयुर्केयर",
      "admin_portal": "व्यवस्थापक पोर्टल",
      "platform_overview": "मंच का अवलोकन",
      "completed_sessions": "पूर्ण सत्र",
      "ngo_impact": "एनजीओ प्रभाव मेट्रिक्स",
      "pharmacy_stock": "फार्मेसी इन्वेंटरी",
      "secure_logout": "सुरक्षित लॉगआउट",
      "command_center": "सामुदायिक स्वास्थ्य कमान केंद्र",
      // NEW: Practitioner Dashboard Vocabulary
      "practitioner": "चिकित्सक",
      "clinic_schedule": "क्लिनिक अनुसूची",
      "patient_directory": "मरीज निर्देशिका",
      "completed_therapies": "पूर्ण थेरेपी",
      "treatment_command": "उपचार कमान केंद्र",
      "prof_portal": "आयुर्केयर व्यावसायिक पोर्टल",
      "needs_approval": "अनुमोदन आवश्यक",
      "upcoming_today": "आज आगामी",
      "therapies_done": "थेरेपी पूर्ण"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", 
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});

export default i18n;