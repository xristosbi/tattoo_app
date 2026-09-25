export type Language = 'el' | 'en'

export const translations = {
  el: {
    // ── Nav (landing) ──────────────────────────────────────
    nav_features: 'Χαρακτηριστικά',
    nav_pricing: 'Τιμολόγηση',
    nav_sign_in: 'Σύνδεση',
    nav_start_free: 'Ξεκίνα Δωρεάν',

    // ── Dashboard nav ──────────────────────────────────────
    nav_generate: 'Δημιουργία',
    nav_history: 'Ιστορικό',
    nav_settings: 'Ρυθμίσεις',

    // ── Landing hero ───────────────────────────────────────
    hero_badge: 'AI-Powered Δημιουργία Στένσιλ',
    hero_h1_1: 'Το Σχέδιό σου.',
    hero_h1_italic: 'Έτοιμο για Στένσιλ',
    hero_h1_2: 'σε Δευτερόλεπτα.',
    hero_subtitle:
      'Ο AI generator στένσιλ που φτιάχτηκε για επαγγελματίες tattoo artists. Ανέβασε οποιοδήποτε σχέδιο — φωτογραφία, σκίτσο, ή ψηφιακό — και πάρε ένα καθαρό, έτοιμο για εκτύπωση στένσιλ.',
    hero_cta_primary: 'Ξεκίνα Δωρεάν — χωρίς κάρτα',
    hero_cta_secondary: 'Σύνδεση',
    hero_note: '3 δωρεάν δημιουργίες · χωρίς πιστωτική κάρτα',
    before_label: 'Πρωτότυπο Σχέδιο',
    after_label: 'Αποτέλεσμα Inkforge',

    // ── Features section ───────────────────────────────────
    features_title: 'Φτιαγμένο για επαγγελματίες artists',
    features_subtitle: 'Ό,τι χρειάζεσαι, τίποτα παραπάνω.',
    feature_img_title: 'Εικόνα σε Στένσιλ',
    feature_img_desc:
      'Ανέβασε οποιαδήποτε φωτογραφία ή σχέδιο και πάρε ένα καθαρό, έτοιμο για εκτύπωση στένσιλ σε δευτερόλεπτα. Ιδανικό για custom σχέδια τατουάζ.',
    feature_txt_title: 'Κείμενο σε Στένσιλ',
    feature_txt_desc:
      'Περίγραψε την ιδέα σου για τατουάζ με λόγια. Ο AI μας δημιουργεί την εικόνα και την μετατρέπει σε επαγγελματικό στένσιλ.',
    feature_team_title: 'Συνεργασία Ομάδας',
    feature_team_desc:
      'Το πλάνο Professional σου επιτρέπει να προσθέσεις έως 3 μέλη ομάδας ώστε όλη η ομάδα σου να δημιουργεί στένσιλ μαζί.',
    feature_secure_title: 'Ιδιωτικό & Ασφαλές',
    feature_secure_desc:
      'Τα σχέδιά σου αποθηκεύονται με ασφάλεια και είναι προσβάσιμα μόνο από εσένα. Δεν μοιραζόμαστε ποτέ τη δουλειά σου.',

    // ── Pricing section ────────────────────────────────────
    pricing_title: 'Απλή, τίμια τιμολόγηση',
    pricing_subtitle: 'Μηνιαίο όριο δημιουργιών. Χωρίς εκπλήξεις. Ακύρωση οποτεδήποτε.',
    most_popular: 'Πιο Δημοφιλές',
    per_month: 'ανά μήνα',
    starter_gens: '20 δημιουργίες στένσιλ',
    plus_gens: '60 δημιουργίες στένσιλ',
    professional_gens: 'Απεριόριστες δημιουργίες',
    starter_f1: 'Εικόνα σε στένσιλ',
    starter_f2: 'Κείμενο σε στένσιλ',
    starter_f3: 'Λήψη PNG (2048 px)',
    starter_f4: 'Ιστορικό 30 ημερών',
    plus_f1: 'Όλα του Starter',
    plus_f2: 'Προτεραιότητα στην ουρά',
    plus_f3: 'Απεριόριστο ιστορικό',
    plus_f4: 'Fine-tuning εντολών',
    professional_f1: 'Όλα του Plus',
    professional_f2: 'Έως 3 μέλη ομάδας',
    professional_f3: 'Κοινή βιβλιοθήκη studio',
    professional_f4: 'Αποκλειστική υποστήριξη',
    cta_starter: 'Ξεκίνα με Starter',
    cta_plus: 'Ξεκίνα με Plus',
    cta_professional: 'Ξεκίνα με Professional',
    unlimited: 'Απεριόριστες',

    // ── Footer ─────────────────────────────────────────────
    footer_copy: 'Φτιαγμένο για tattoo artists.',

    // ── Auth ───────────────────────────────────────────────
    login_title: 'Καλώς ήρθες',
    login_subtitle: 'Σύνδεσε στον λογαριασμό σου στο Inkforge',
    no_account: 'Δεν έχεις λογαριασμό;',
    signup_link: 'Εγγραφή δωρεάν',
    signup_title: 'Δημιούργησε λογαριασμό',
    signup_subtitle: 'Ξεκίνα με 3 δωρεάν δημιουργίες — χωρίς πιστωτική κάρτα',
    have_account: 'Έχεις ήδη λογαριασμό;',
    login_link: 'Σύνδεση',
    email_label: 'Email',
    password_label: 'Κωδικός',
    name_label: 'Ονοματεπώνυμο',
    name_placeholder: 'Γιάννης Παπαδόπουλος',
    password_placeholder: 'Τουλάχιστον 8 χαρακτήρες',
    password_error: 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες',
    login_btn: 'Σύνδεση',
    signup_btn: 'Δημιουργία Λογαριασμού',
    terms_text: 'Με την εγγραφή σου, αποδέχεσαι τους όρους χρήσης και την πολιτική απορρήτου.',

    // ── Generate page ──────────────────────────────────────
    gen_page_title: 'Δημιουργία Στένσιλ',
    gen_page_subtitle: 'Ανέβασε φωτογραφία ή περίγραψε το σχέδιό σου',
    tab_image: 'Εικόνα σε Στένσιλ',
    tab_text: 'Κείμενο σε Στένσιλ',
    tab_image_short: 'Εικόνα',
    tab_text_short: 'Κείμενο',
    usage_unlimited: 'δημιουργίες αυτόν τον μήνα',
    usage_limited: 'αυτόν τον μήνα',
    idle_placeholder: 'Το στένσιλ σου θα εμφανιστεί εδώ',
    error_title: 'Αποτυχία δημιουργίας',
    error_generic: 'Κάτι πήγε στραβά. Παρακαλώ δοκίμασε ξανά.',
    error_quota: 'Εξαντλήθηκαν οι δημιουργίες σου για αυτόν τον μήνα.',
    upgrade_plan: 'Αναβάθμιση πλάνου',
    try_again: 'Δοκίμασε ξανά',

    // ── Upload tab ─────────────────────────────────────────
    upload_zone: 'Σύρε το σχέδιό σου εδώ ή κάνε κλικ για ανέβασμα',
    upload_hint: 'JPEG, PNG, WebP · Μέγιστο 10MB',
    upload_invalid_type: 'Παρακαλώ ανέβασε εικόνα JPEG, PNG, WebP ή GIF.',
    upload_too_large: 'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 10MB.',
    generate_btn: 'Δημιουργία Στένσιλ',
    generating: 'Δημιουργία…',

    // ── Text prompt tab ────────────────────────────────────
    prompt_label: 'Περίγραψε την ιδέα σου για τατουάζ',
    prompt_placeholder: 'π.χ. Παραδοσιακό ιαπωνικό κοϊ ψάρι με λωτούς, τολμηρές γραμμές...',
    try_example: 'Δοκίμασε ένα παράδειγμα',
    example_1: 'Παραδοσιακό ιαπωνικό κοϊ ψάρι με λωτούς, τολμηρές γραμμές',
    example_2: 'Γεωμετρικό κρανίο λύκου με μαντάλα',
    example_3: 'Κλασική άγκυρα με τριαντάφυλλα, ναυτικό στυλ',
    example_4: 'Μινιμαλιστική οροσειρά με έλατα',

    // ── Progress ───────────────────────────────────────────
    progress_img_1: 'Ανέβασμα εικόνας…',
    progress_img_2: 'Ανίχνευση γραμμών και περιγραμμάτων…',
    progress_img_3: 'Εξαγωγή σχεδίου…',
    progress_img_4: 'Καθαρισμός στένσιλ…',
    progress_img_5: 'Οριστικοποίηση…',
    progress_txt_1: 'Ανάλυση ιδέας…',
    progress_txt_2: 'Δημιουργία εικόνας…',
    progress_txt_3: 'Εξαγωγή σχεδίου…',
    progress_txt_4: 'Μετατροπή σε στένσιλ…',
    progress_txt_5: 'Οριστικοποίηση…',
    progress_eta: 'Συνήθως διαρκεί 20–60 δευτερόλεπτα',

    // ── Result ─────────────────────────────────────────────
    result_ready: 'Το στένσιλ είναι έτοιμο!',
    download_png: 'Λήψη PNG',
    new_stencil: 'Νέο',

    // ── History ────────────────────────────────────────────
    history_title: 'Ιστορικό',
    history_count_s: 'ολοκληρωμένο στένσιλ',
    history_count_p: 'ολοκληρωμένα στένσιλ',
    stat_total: 'Σύνολο',
    stat_since: 'από την εγγραφή',
    stat_this_month: 'Αυτόν τον μήνα',
    stat_remaining: 'απομένουν',
    stat_unlimited_lbl: 'απεριόριστο',
    stat_plan: 'Πλάνο',
    stat_per_month: 'ανά μήνα',
    stat_breakdown: 'Εικόνα / Κείμενο',
    stat_analysis: 'ανάλυση',
    history_empty_title: 'Δεν υπάρχουν στένσιλ ακόμα',
    history_empty_sub: 'Τα στένσιλ που δημιουργείς θα εμφανίζονται εδώ',
    type_image: 'Εικόνα',
    type_text: 'Κείμενο',

    // ── Settings ───────────────────────────────────────────
    settings_title: 'Ρυθμίσεις',
    settings_subtitle: 'Διαχείριση λογαριασμού και συνδρομής',
    subscription_title: 'Συνδρομή',
    plan_label: 'Πλάνο',
    manage_billing: 'Διαχείριση χρέωσης',
    cancels_on: 'Ακυρώνεται στις',
    renews_on: 'Ανανεώνεται στις',
    upgrade_section: 'Αναβάθμιση',
    gens_per_month: 'δημιουργίες/μήνα',
    upgrade_btn: 'Αναβάθμιση',
    upgrade_to_professional: 'Αναβάθμιση σε Professional',
    unlimited_desc: 'Απεριόριστες δημιουργίες',
    usage_title: 'Χρήση αυτόν τον μήνα',
    stencils_generated: 'στένσιλ δημιουργήθηκαν',
    percent_used: 'χρησιμοποιήθηκε',
    unlimited_plan_desc: 'Απεριόριστες δημιουργίες στο Professional πλάνο',
    resets_on: 'Επαναφέρεται στις',

    // ── Upgrade modal ──────────────────────────────────────
    upgrade_modal_title: 'Αναβάθμισε το πλάνο σου',
    upgrade_modal_desc:
      'Εξαντλήσατε τις δημιουργίες αυτού του μήνα. Αναβαθμίστε για να συνεχίσετε.',
    upgrade_to_starter: 'Αναβάθμιση σε Starter',
    upgrade_to_plus: 'Αναβάθμιση σε Plus',

    // ── UserMenu ───────────────────────────────────────────
    billing_portal: 'Διαχείριση χρέωσης',
    sign_out: 'Αποσύνδεση',
  },

  en: {
    // ── Nav (landing) ──────────────────────────────────────
    nav_features: 'Features',
    nav_pricing: 'Pricing',
    nav_sign_in: 'Sign in',
    nav_start_free: 'Start free',

    // ── Dashboard nav ──────────────────────────────────────
    nav_generate: 'Generate',
    nav_history: 'History',
    nav_settings: 'Settings',

    // ── Landing hero ───────────────────────────────────────
    hero_badge: 'AI-Powered Stencil Generation',
    hero_h1_1: 'Your design.',
    hero_h1_italic: 'Stencil-ready',
    hero_h1_2: 'in seconds.',
    hero_subtitle:
      'The AI stencil generator built for professional tattoo artists. Upload any design — photograph, sketch, or digital art — and get a clean, print-ready stencil.',
    hero_cta_primary: 'Start free — no card needed',
    hero_cta_secondary: 'Sign in',
    hero_note: '3 free generations · no credit card required',
    before_label: 'Original Design',
    after_label: 'Inkforge Output',

    // ── Features section ───────────────────────────────────
    features_title: 'Built for working artists',
    features_subtitle: "Everything you need, nothing you don't.",
    feature_img_title: 'Image to Stencil',
    feature_img_desc:
      'Upload any photo or drawing and get a clean, print-ready stencil in seconds. Perfect for custom tattoo designs.',
    feature_txt_title: 'Text to Stencil',
    feature_txt_desc:
      'Describe your tattoo concept in words. Our AI generates the image and converts it into a professional stencil.',
    feature_team_title: 'Team Collaboration',
    feature_team_desc:
      'Professional tier lets you add up to 3 team members so your whole crew can generate stencils together.',
    feature_secure_title: 'Private & Secure',
    feature_secure_desc:
      'Your designs are stored securely and are only accessible to you. We never share your work.',

    // ── Pricing section ────────────────────────────────────
    pricing_title: 'Simple, honest pricing',
    pricing_subtitle: 'One monthly generation allowance. No surprises. Cancel anytime.',
    most_popular: 'Most Popular',
    per_month: 'per month',
    starter_gens: '20 stencil generations',
    plus_gens: '60 stencil generations',
    professional_gens: 'Unlimited generations',
    starter_f1: 'Image to stencil',
    starter_f2: 'Text to stencil',
    starter_f3: 'PNG download (2048 px)',
    starter_f4: '30-day history',
    plus_f1: 'Everything in Starter',
    plus_f2: 'Priority generation queue',
    plus_f3: 'Unlimited history',
    plus_f4: 'Prompt fine-tuning',
    professional_f1: 'Everything in Plus',
    professional_f2: 'Up to 3 team members',
    professional_f3: 'Shared studio library',
    professional_f4: 'Dedicated support',
    cta_starter: 'Get Starter',
    cta_plus: 'Get Plus',
    cta_professional: 'Get Professional',
    unlimited: 'Unlimited',

    // ── Footer ─────────────────────────────────────────────
    footer_copy: 'Built for tattoo artists.',

    // ── Auth ───────────────────────────────────────────────
    login_title: 'Welcome back',
    login_subtitle: 'Sign in to your Inkforge account',
    no_account: "Don't have an account?",
    signup_link: 'Sign up free',
    signup_title: 'Create your account',
    signup_subtitle: 'Start with 3 free generations — no credit card required',
    have_account: 'Already have an account?',
    login_link: 'Log in',
    email_label: 'Email',
    password_label: 'Password',
    name_label: 'Full name',
    name_placeholder: 'Jane Doe',
    password_placeholder: 'At least 8 characters',
    password_error: 'Password must be at least 8 characters',
    login_btn: 'Log in',
    signup_btn: 'Create Account',
    terms_text: 'By signing up, you agree to our terms of service and privacy policy.',

    // ── Generate page ──────────────────────────────────────
    gen_page_title: 'Generate Stencil',
    gen_page_subtitle: 'Upload a photo or describe your tattoo concept',
    tab_image: 'Image to Stencil',
    tab_text: 'Text to Stencil',
    tab_image_short: 'Image',
    tab_text_short: 'Text',
    usage_unlimited: 'generated this month',
    usage_limited: 'this month',
    idle_placeholder: 'Your stencil will appear here',
    error_title: 'Generation failed',
    error_generic: 'Something went wrong. Please try again.',
    error_quota: 'You have used all your generations for this month.',
    upgrade_plan: 'Upgrade plan',
    try_again: 'Try again',

    // ── Upload tab ─────────────────────────────────────────
    upload_zone: 'Drop your image here or click to upload',
    upload_hint: 'JPEG, PNG, WebP · Max 10MB',
    upload_invalid_type: 'Please upload a JPEG, PNG, WebP, or GIF image.',
    upload_too_large: 'File too large. Maximum size is 10MB.',
    generate_btn: 'Generate Stencil',
    generating: 'Generating…',

    // ── Text prompt tab ────────────────────────────────────
    prompt_label: 'Describe your tattoo concept',
    prompt_placeholder: 'e.g. Traditional Japanese koi fish with lotus flowers, bold outlines...',
    try_example: 'Try an example',
    example_1: 'Traditional Japanese koi fish with lotus flowers, bold outlines',
    example_2: 'Geometric wolf skull with mandala patterns',
    example_3: 'Classic anchor with rope and roses, sailor style',
    example_4: 'Minimalist mountain range with pine trees',

    // ── Progress ───────────────────────────────────────────
    progress_img_1: 'Uploading image…',
    progress_img_2: 'Detecting edges and lines…',
    progress_img_3: 'Extracting line art…',
    progress_img_4: 'Cleaning up stencil…',
    progress_img_5: 'Finalizing output…',
    progress_txt_1: 'Interpreting your concept…',
    progress_txt_2: 'Generating illustration…',
    progress_txt_3: 'Extracting line art…',
    progress_txt_4: 'Converting to stencil…',
    progress_txt_5: 'Finalizing output…',
    progress_eta: 'This usually takes 20–60 seconds',

    // ── Result ─────────────────────────────────────────────
    result_ready: 'Stencil ready!',
    download_png: 'Download PNG',
    new_stencil: 'New',

    // ── History ────────────────────────────────────────────
    history_title: 'History',
    history_count_s: 'completed stencil',
    history_count_p: 'completed stencils',
    stat_total: 'Total generated',
    stat_since: 'since joining',
    stat_this_month: 'This month',
    stat_remaining: 'remaining',
    stat_unlimited_lbl: 'unlimited plan',
    stat_plan: 'Plan',
    stat_per_month: 'per month',
    stat_breakdown: 'Image / Text',
    stat_analysis: 'breakdown',
    history_empty_title: 'No stencils yet',
    history_empty_sub: 'Your generated stencils will appear here',
    type_image: 'Image',
    type_text: 'Text',

    // ── Settings ───────────────────────────────────────────
    settings_title: 'Settings',
    settings_subtitle: 'Manage your account and subscription',
    subscription_title: 'Subscription',
    plan_label: 'plan',
    manage_billing: 'Manage billing',
    cancels_on: 'Cancels on',
    renews_on: 'Renews on',
    upgrade_section: 'Upgrade',
    gens_per_month: 'gens/month',
    upgrade_btn: 'Upgrade',
    upgrade_to_professional: 'Upgrade to Professional',
    unlimited_desc: 'Unlimited generations',
    usage_title: 'Usage this month',
    stencils_generated: 'stencils generated',
    percent_used: 'used',
    unlimited_plan_desc: 'Unlimited generations on Professional plan',
    resets_on: 'Resets on',

    // ── Upgrade modal ──────────────────────────────────────
    upgrade_modal_title: 'Upgrade your plan',
    upgrade_modal_desc:
      "You've used all your generations for this month. Upgrade to keep creating stencils.",
    upgrade_to_starter: 'Upgrade to Starter',
    upgrade_to_plus: 'Upgrade to Plus',

    // ── UserMenu ───────────────────────────────────────────
    billing_portal: 'Billing portal',
    sign_out: 'Sign out',
  },
} as const

export type TranslationKey = keyof typeof translations.en
