'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  translate: (text: string, section: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Add navbar translations and expand existing sections
const translations = {
  english: {
    navbar: {
      appName: "BrightMind",
      home: "Home",
      content: "Content",
      about: "About",
      profile: "Profile",
      login: "Login"
    },
    hero: {
      title: "Transform Learning with AI-Generated Educational Content",
      description: "Create comprehensive study materials with personalized PDF generation in seconds.",
      getStarted: "Get Started",
      learnMore: "Learn More",
      contentGeneration: "Generate Content",
    },
    features: {
      keyFeatures: "Key Features",
      discover: "Discover how BrightMind helps educators create engaging and professional learning materials",
      pdfGeneration: "PDF Generation",
      pdfGenerationDescription: "Convert your content into beautifully formatted PDF documents with one click",
      customLessonPlans: "Custom Lesson Plans",
      customLessonPlansDescription: "Create personalized lesson plans tailored to specific learning objectives",
      aiPoweredContent: "AI-Powered Content",
      aiPoweredContentDescription: "Leverage advanced AI to generate high-quality educational materials",
      collaborativeLearning: "Collaborative Learning",
      collaborativeLearningDescription: "Share and collaborate on content with colleagues and students",
      assessmentTools: "Assessment Tools",
      assessmentToolsDescription: "Create quizzes, tests, and assessments for your students",
      customizableTemplates: "Customizable Templates",
      customizableTemplatesDescription: "Choose from a variety of templates to match your teaching style"
    },
    demo: {
      oneClickPdfGeneration: "One-Click PDF Generation",
      oneClickPdfGenerationDescription: "Transform your content into professionally formatted PDF documents instantly",
      professionallyFormattedDocuments: "Professionally formatted documents",
      instantDownloads: "Instant downloads",
      customizableStylingOptions: "Customizable styling options",
      tryItNow: "Try It Now",
      quantumPhysicsLesson: "Quantum Physics Lesson",
      quantumPhysicsLessonDescription: "An advanced lesson on quantum mechanics principles for high school physics",
      advanced: "Advanced",
      downloadAsPdf: "Download as PDF"
    },
    howItWorks: {
      howItWorks: "How It Works",
      chooseYourTopic: "Choose Your Topic",
      chooseYourTopicDescription: "Select from a wide range of subjects or create your own custom topic",
      customizeOptions: "Customize Options",
      customizeOptionsDescription: "Adjust difficulty level, length, and format to match your teaching needs",
      generateContent: "Generate Content",
      generateContentDescription: "Our AI creates comprehensive, engaging educational content in seconds",
      downloadAsPdf: "Download as PDF",
      downloadAsPdfDescription: "Get your content in a professionally formatted PDF ready for sharing"
    },
    cta: {
      readyToTransform: "Ready to Transform Your Educational Content?",
      joinThousands: "Join thousands of educators who are already creating better learning materials with BrightMind",
      createContentNow: "Create Content Now",
      signUpForFree: "Sign Up For Free"
    },
    footer: {
      footerDescription: "AI-powered educational content generation platform for educators and students",
      quickLinks: "Quick Links",
      home: "Home",
      content: "Content",
      myProfile: "My Profile",
      contact: "Contact",
      supportEmail: "support@brightmind.edu",
      allRightsReserved: "All Rights Reserved"
    }
  },
  kannada: {
    navbar: {
      appName: "ಬ್ರೈಟ್‌ಮೈಂಡ್",
      home: "ಮುಖಪುಟ",
      content: "ವಿಷಯ",
      about: "ನಮ್ಮ ಬಗ್ಗೆ",
      profile: "ಪ್ರೊಫೈಲ್",
      login: "ಲಾಗಿನ್"
    },
    hero: {
      title: "AI-ಜನಿತ ಶೈಕ್ಷಣಿಕ ವಿಷಯದೊಂದಿಗೆ ಕಲಿಕೆಯನ್ನು ಪರಿವರ್ತಿಸಿ",
      description: "ಸೆಕೆಂಡುಗಳಲ್ಲಿ ವೈಯಕ್ತಿಕ PDF ರಚನೆಯೊಂದಿಗೆ ಸಮಗ್ರ ಅಧ್ಯಯನ ಸಾಮಗ್ರಿಗಳನ್ನು ರಚಿಸಿ.",
      getStarted: "ಪ್ರಾರಂಭಿಸಿ",
      learnMore: "ಇನ್ನಷ್ಟು ತಿಳಿಯಿರಿ",
      contentGeneration: "ವಿಷಯವನ್ನು ರಚಿಸಿ",
    },
    features: {
      keyFeatures: "ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು",
      discover: "ಶಿಕ್ಷಕರು ಆಕರ್ಷಕ ಮತ್ತು ವೃತ್ತಿಪರ ಕಲಿಕಾ ಸಾಮಗ್ರಿಗಳನ್ನು ರಚಿಸಲು BrightMind ಹೇಗೆ ಸಹಾಯ ಮಾಡುತ್ತದೆ ಎಂಬುದನ್ನು ಅನ್ವೇಷಿಸಿ",
      pdfGeneration: "PDF ರಚನೆ",
      pdfGenerationDescription: "ನಿಮ್ಮ ವಿಷಯವನ್ನು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಸುಂದರವಾಗಿ ಫಾರ್ಮ್ಯಾಟ್ ಮಾಡಿದ PDF ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ",
      customLessonPlans: "ಕಸ್ಟಮ್ ಪಾಠ ಯೋಜನೆಗಳು",
      customLessonPlansDescription: "ನಿರ್ದಿಷ್ಟ ಕಲಿಕಾ ಉದ್ದೇಶಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಪಾಠ ಯೋಜನೆಗಳನ್ನು ರಚಿಸಿ",
      aiPoweredContent: "AI-ಪವರ್ಡ್ ವಿಷಯ",
      aiPoweredContentDescription: "ಉನ್ನತ ಗುಣಮಟ್ಟದ ಶೈಕ್ಷಣಿಕ ಸಾಮಗ್ರಿಗಳನ್ನು ರಚಿಸಲು ಅಡ್ವಾನ್ಸ್ಡ್ AI ಬಳಸಿ",
      collaborativeLearning: "ಸಹಯೋಗಿ ಕಲಿಕೆ",
      collaborativeLearningDescription: "ಸಹೋದ್ಯೋಗಿಗಳು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳೊಂದಿಗೆ ವಿಷಯವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಸಹಯೋಗ ಮಾಡಿ",
      assessmentTools: "ಮೌಲ್ಯಮಾಪನ ಉಪಕರಣಗಳು",
      assessmentToolsDescription: "ನಿಮ್ಮ ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ ಕ್ವಿಜ್‌ಗಳು, ಪರೀಕ್ಷೆಗಳು ಮತ್ತು ಮೌಲ್ಯಮಾಪನಗಳನ್ನು ರಚಿಸಿ",
      customizableTemplates: "ಕಸ್ಟಮೈಸ್ ಮಾಡಬಹುದಾದ ಟೆಂಪ್ಲೇಟ್‌ಗಳು",
      customizableTemplatesDescription: "ನಿಮ್ಮ ಬೋಧನಾ ಶೈಲಿಗೆ ಹೊಂದಿಕೆಯಾಗುವಂತೆ ವಿವಿಧ ಟೆಂಪ್ಲೇಟ್‌ಗಳಿಂದ ಆಯ್ಕೆ ಮಾಡಿ"
    },
    demo: {
      oneClickPdfGeneration: "ಒಂದು-ಕ್ಲಿಕ್ PDF ರಚನೆ",
      oneClickPdfGenerationDescription: "ನಿಮ್ಮ ವಿಷಯವನ್ನು ತಕ್ಷಣವೇ ವೃತ್ತಿಪರವಾಗಿ ಫಾರ್ಮ್ಯಾಟ್ ಮಾಡಿದ PDF ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ",
      professionallyFormattedDocuments: "ವೃತ್ತಿಪರವಾಗಿ ಫಾರ್ಮ್ಯಾಟ್ ಮಾಡಿದ ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳು",
      instantDownloads: "ತಕ್ಷಣದ ಡೌನ್‌ಲೋಡ್‌ಗಳು",
      customizableStylingOptions: "ಕಸ್ಟಮೈಸ್ ಮಾಡಬಹುದಾದ ಶೈಲಿ ಆಯ್ಕೆಗಳು",
      tryItNow: "ಈಗ ಪ್ರಯತ್ನಿಸಿ",
      quantumPhysicsLesson: "ಕ್ವಾಂಟಮ್ ಭೌತಶಾಸ್ತ್ರ ಪಾಠ",
      quantumPhysicsLessonDescription: "ಹೈಸ್ಕೂಲ್ ಭೌತಶಾಸ್ತ್ರಕ್ಕಾಗಿ ಕ್ವಾಂಟಮ್ ಮೆಕ್ಯಾನಿಕ್ಸ್ ತತ್ವಗಳ ಕುರಿತು ಸುಧಾರಿತ ಪಾಠ",
      advanced: "ಸುಧಾರಿತ",
      downloadAsPdf: "PDF ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
    },
    howItWorks: {
      howItWorks: "ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ",
      chooseYourTopic: "ನಿಮ್ಮ ವಿಷಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
      chooseYourTopicDescription: "ವಿಶಾಲ ಶ್ರೇಣಿಯ ವಿಷಯಗಳಿಂದ ಆಯ್ಕೆ ಮಾಡಿ ಅಥವಾ ನಿಮ್ಮ ಸ್ವಂತ ಕಸ್ಟಮ್ ವಿಷಯವನ್ನು ರಚಿಸಿ",
      customizeOptions: "ಆಯ್ಕೆಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ",
      customizeOptionsDescription: "ನಿಮ್ಮ ಬೋಧನಾ ಅಗತ್ಯಗಳಿಗೆ ಹೊಂದಿಕೆಯಾಗುವಂತೆ ಕಠಿಣತೆಯ ಮಟ್ಟ, ಉದ್ದ ಮತ್ತು ಸ್ವರೂಪವನ್ನು ಹೊಂದಿಸಿ",
      generateContent: "ವಿಷಯವನ್ನು ರಚಿಸಿ",
      generateContentDescription: "ನಮ್ಮ AI ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಸಮಗ್ರ, ಆಕರ್ಷಕ ಶೈಕ್ಷಣಿಕ ವಿಷಯವನ್ನು ರಚಿಸುತ್ತದೆ",
      downloadAsPdf: "PDF ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      downloadAsPdfDescription: "ಹಂಚಿಕೊಳ್ಳಲು ಸಿದ್ಧವಾಗಿರುವ ಪ್ರೊಫೆಶನಲ್ ಫಾರ್ಮ್ಯಾಟ್ ಮಾಡಿದ PDF ನಲ್ಲಿ ನಿಮ್ಮ ವಿಷಯವನ್ನು ಪಡೆಯಿರಿ"
    },
    cta: {
      readyToTransform: "ನಿಮ್ಮ ಶೈಕ್ಷಣಿಕ ವಿಷಯವನ್ನು ಪರಿವರ್ತಿಸಲು ಸಿದ್ಧವಾಗಿದ್ದೀರಾ?",
      joinThousands: "BrightMind ನೊಂದಿಗೆ ಈಗಾಗಲೇ ಉತ್ತಮ ಕಲಿಕಾ ಸಾಮಗ್ರಿಗಳನ್ನು ರಚಿಸುತ್ತಿರುವ ಸಾವಿರಾರು ಶಿಕ್ಷಕರೊಂದಿಗೆ ಸೇರಿ",
      createContentNow: "ಈಗ ವಿಷಯವನ್ನು ರಚಿಸಿ",
      signUpForFree: "ಉಚಿತವಾಗಿ ಸೈನ್ ಅಪ್ ಮಾಡಿ"
    },
    footer: {
      footerDescription: "ಶಿಕ್ಷಕರು ಮತ್ತು ವಿದ್ಯಾರ್ಥಿಗಳಿಗಾಗಿ AI-ಪವರ್ಡ್ ಶೈಕ್ಷಣಿಕ ವಿಷಯ ರಚನಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್",
      quickLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
      home: "ಮುಖಪುಟ",
      content: "ವಿಷಯ",
      myProfile: "ನನ್ನ ಪ್ರೊಫೈಲ್",
      contact: "ಸಂಪರ್ಕ",
      supportEmail: "support@brightmind.edu",
      allRightsReserved: "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ"
    }
  },
  hindi: {
    navbar: {
      appName: "ब्राइटमाइंड",
      home: "होम",
      content: "सामग्री",
      about: "हमारे बारे में",
      profile: "प्रोफाइल",
      login: "लॉगिन"
    },
    hero: {
      title: "AI-जनित शैक्षिक सामग्री के साथ सीखने को बदलें",
      description: "सेकंडों में वैयक्तिकृत PDF जनरेशन के साथ व्यापक अध्ययन सामग्री बनाएं।",
      getStarted: "शुरू करें",
      learnMore: "और जानें",
      contentGeneration: "सामग्री बनाएं",
    },
    features: {
      keyFeatures: "मुख्य विशेषताएँ",
      discover: "जानें कि BrightMind शिक्षकों को आकर्षक और पेशेवर शिक्षण सामग्री बनाने में कैसे मदद करता है",
      pdfGeneration: "PDF जनरेशन",
      pdfGenerationDescription: "अपनी सामग्री को एक क्लिक में सुंदर फॉर्मेटेड PDF दस्तावेजों में बदलें",
      customLessonPlans: "कस्टम पाठ योजनाएँ",
      customLessonPlansDescription: "विशिष्ट सीखने के उद्देश्यों के अनुरूप व्यक्तिगत पाठ योजनाएँ बनाएँ",
      aiPoweredContent: "AI-संचालित सामग्री",
      aiPoweredContentDescription: "उच्च गुणवत्ता वाली शैक्षिक सामग्री बनाने के लिए उन्नत AI का लाभ उठाएँ",
      collaborativeLearning: "सहयोगात्मक सीखना",
      collaborativeLearningDescription: "सहकर्मियों और छात्रों के साथ सामग्री साझा करें और सहयोग करें",
      assessmentTools: "मूल्यांकन उपकरण",
      assessmentToolsDescription: "अपने छात्रों के लिए क्विज़, परीक्षण और मूल्यांकन बनाएँ",
      customizableTemplates: "अनुकूलन योग्य टेम्पलेट्स",
      customizableTemplatesDescription: "अपनी शिक्षण शैली के अनुरूप विभिन्न टेम्पलेट्स से चुनें"
    },
    demo: {
      oneClickPdfGeneration: "वन-क्लिक PDF जनरेशन",
      oneClickPdfGenerationDescription: "अपनी सामग्री को तुरंत पेशेवर रूप से फॉर्मेटेड PDF दस्तावेजों में बदलें",
      professionallyFormattedDocuments: "पेशेवर रूप से फॉर्मेटेड दस्तावेज़",
      instantDownloads: "तत्काल डाउनलोड",
      customizableStylingOptions: "अनुकूलन योग्य स्टाइलिंग विकल्प",
      tryItNow: "अभी आज़माएं",
      quantumPhysicsLesson: "क्वांटम भौतिकी पाठ",
      quantumPhysicsLessonDescription: "हाई स्कूल भौतिकी के लिए क्वांटम मैकेनिक्स सिद्धांतों पर एक उन्नत पाठ",
      advanced: "उन्नत",
      downloadAsPdf: "PDF के रूप में डाउनलोड करें"
    },
    howItWorks: {
      howItWorks: "यह कैसे काम करता है",
      chooseYourTopic: "अपना विषय चुनें",
      chooseYourTopicDescription: "विषयों की विस्तृत श्रृंखला से चुनें या अपना स्वयं का कस्टम विषय बनाएं",
      customizeOptions: "विकल्प अनुकूलित करें",
      customizeOptionsDescription: "अपनी शिक्षण आवश्यकताओं के अनुरूप कठिनाई स्तर, लंबाई और प्रारूप समायोजित करें",
      generateContent: "सामग्री उत्पन्न करें",
      generateContentDescription: "हमारा AI सेकंडों में व्यापक, आकर्षक शैक्षिक सामग्री बनाता है",
      downloadAsPdf: "PDF के रूप में डाउनलोड करें",
      downloadAsPdfDescription: "अपनी सामग्री को साझा करने के लिए तैयार पेशेवर रूप से फॉर्मेटेड PDF में प्राप्त करें"
    },
    cta: {
      readyToTransform: "अपनी शैक्षिक सामग्री को बदलने के लिए तैयार हैं?",
      joinThousands: "हजारों शिक्षकों से जुड़ें जो पहले से ही BrightMind के साथ बेहतर शिक्षण सामग्री बना रहे हैं",
      createContentNow: "अभी सामग्री बनाएं",
      signUpForFree: "मुफ्त में साइन अप करें"
    },
    footer: {
      footerDescription: "शिक्षकों और छात्रों के लिए AI-संचालित शैक्षिक सामग्री निर्माण प्लेटफॉर्म",
      quickLinks: "त्वरित लिंक",
      home: "होम",
      content: "सामग्री",
      myProfile: "मेरी प्रोफाइल",
      contact: "संपर्क",
      supportEmail: "support@brightmind.edu",
      allRightsReserved: "सर्वाधिकार सुरक्षित"
    }
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('english');

  // Update HTML attribute when language changes
  useEffect(() => {
    document.documentElement.setAttribute('data-language', language);
  }, [language]);

  const translate = (key: string, section: string) => {
    try {
      //@ts-ignore - We'll handle missing translations gracefully
      return translations[language][section][key] || key;
    } catch (error) {
      return key; // Return the original key if translation is missing
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}