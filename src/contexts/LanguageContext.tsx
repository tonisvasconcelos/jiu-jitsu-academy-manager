import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'ENU' | 'PTB' | 'GER' | 'FRA' | 'ESP'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation keys
const translations = {
  ENU: {
    // Main Menu Items
    'students': 'Students',
    'teachers': 'Teachers',
    'championships': 'Championships',
    'classes': 'Classes',
    'fight-plans': 'Fight Plans',
    'fight-modalities': 'Fight Modalities',
    'modality-registration': 'Modality Registration',
    'modality-management': 'Modality Management',
    'modality-name': 'Modality Name',
    'modality-description': 'Description',
    'modality-type': 'Modality Type',
    'modality-level': 'Level',
    'modality-duration': 'Duration (minutes)',
    'modality-active': 'Active',
    'quality-evaluation': 'Quality & Evaluation',
    'branches': 'Branches',
    'schedules-checkins': 'Schedules & Check-Ins',
    'administration': 'Administration',
    
    // Students Sub-items
    'student-registration': 'Student Registration',
    'student-profiles': 'Student Profiles',
    'modality-by-student': 'FIGHT TRAINING PLAN',
    'student-evaluation': 'Student Evaluation & Grades',
    'student-attendance': 'Student Attendance',
    
    // Teachers Sub-items
    'teacher-registration': 'Teacher Registration',
    'teacher-profiles': 'Teacher Profiles',
    'assign-teachers': 'Assign Teachers to Classes',
    'teacher-evaluations': 'Teacher Evaluations',
    
    // Championships Sub-items
    'championship-registration': 'Championship Registration',
    'student-enrollment': 'Student Enrollment in Championships',
    'championship-results': 'Championship Results',
    'ranking-statistics': 'Ranking & Statistics',
    
    // Classes Sub-items
    'class-setup': 'Class Setup by Modality',
    'schedule-management': 'Schedule Management',
    'check-in-attendance': 'Check-In / Attendance Tracking',
    'class-capacity': 'Class Capacity & Limits',
    
    // Fight Plans Sub-items
    'plan-templates': 'Plan Templates',
    'assign-plans': 'Assign Plans to Students',
    'training-phases': 'Training Phases & Milestones',
    
    // Quality & Evaluation Sub-items
    'progress-reports': 'Student Progress Reports',
    'teacher-feedback': 'Teacher Feedback',
    'fitness-tests': 'Fitness Tests & Metrics',
    
    // Branches Sub-items
    'branch-registration': 'Branch Registration',
    'branch-details': 'Branch Details (location, contact)',
    'assign-branch': 'Assign Students/Teachers per Branch',
    'branch-schedules': 'Branch Schedules',
    'branch-facilities': 'Branch Facilities',
    'branch-reports': 'Branch Reports',
    
    // Schedules & Check-Ins Sub-items
    'weekly-timetable': 'Weekly Timetable',
    'booking-system': 'Student Booking System',
    'attendance-log': 'Real-Time Attendance Log',
    
    // Administration Sub-items
    'user-profiles': 'User Profiles & Roles',
    'language-selector': 'Language Selector',
    'app-settings': 'App Settings',
    
    // Common
    'dashboard': 'Dashboard',
    'academy-manager': 'Academy Manager',
    'management-system': 'Management System',
    'welcome-message': 'Welcome to your Jiu-Jitsu Academy Management System - Modern UI Deployed! 🚀',
    'total-students': 'Total Students',
    'active-students': 'Active Students',
    'black-belts': 'Black Belts',
    'belt-level-counts': 'Belt Level Counts',
    'white-belts': 'White Belts',
    'blue-belts': 'Blue Belts',
    'purple-belts': 'Purple Belts',
    'brown-belts': 'Brown Belts',
    'export-to-excel': 'Export to Excel',
    'export-students': 'Export Students',
    'import-from-excel': 'Import from Excel',
    'import-students': 'Import Students',
    'select-excel-file': 'Select Excel File',
    'import-success': 'Import Successful',
    'import-error': 'Import Error',
    'imported-students': 'Imported Students',
    'import-summary': 'Import Summary',
    'file-format-help': 'File Format Help',
    'download-template': 'Download Template',
    'filter-students': 'Filter Students',
    'search-students': 'Search Students',
    'filter-by-belt': 'Filter by Belt',
    'filter-by-gender': 'Filter by Gender',
    'filter-by-status': 'Filter by Status',
    'all-belts': 'All Belts',
    'all-genders': 'All Genders',
    'all-status': 'All Status',
    'clear-filters': 'Clear Filters',
    'active-only': 'Active Only',
    'inactive-only': 'Inactive Only',
    'student-modality-management': 'Student Modality Management',
    'student-modality-connections': 'Student Modality Connections',
    'assign-modalities': 'Assign Modalities',
    'student-modality': 'Student Modality',
    'assigned-modalities': 'Assigned Modalities',
    'modality-assignment': 'Modality Assignment',
    'select-student': 'Select Student',
    'select-modalities': 'Select Modalities',
    'assignment-date': 'Assignment Date',
    'instructors': 'Instructors',
    'recent-activity': 'Recent Activity',
    'no-recent-activity': 'No recent activity',
    'start-adding': 'Start by adding students or instructors',
    'quick-actions': 'Quick Actions',
    'add-new-student': 'Add New Student',
    'add-new-instructor': 'Add New Instructor',
    'add-martial-art-type': 'Add Martial Art Type',
    'welcome-admin': 'Welcome back, Admin',
    'language': 'Language',
    'select-language': 'Select Language',
    'portuguese': 'Portuguese',
    'english': 'English',
    'save-settings': 'Save Settings',
    'settings-saved': 'Settings saved successfully!'
  },
  PTB: {
    // Main Menu Items
    'students': 'Alunos',
    'teachers': 'Professores',
    'championships': 'Campeonatos',
    'classes': 'Turmas',
    'fight-plans': 'Planos de Luta',
    'fight-modalities': 'Modalidades de Luta',
    'modality-registration': 'Cadastro de Modalidades',
    'modality-management': 'Gestão de Modalidades',
    'modality-name': 'Nome da Modalidade',
    'modality-description': 'Descrição',
    'modality-type': 'Tipo de Modalidade',
    'modality-level': 'Nível',
    'modality-duration': 'Duração (minutos)',
    'modality-active': 'Ativo',
    'quality-evaluation': 'Qualidade & Avaliação',
    'branches': 'Filiais',
    'schedules-checkins': 'Agenda & Check-Ins',
    'administration': 'Administração',
    
    // Students Sub-items
    'student-registration': 'Cadastro de Alunos',
    'student-profiles': 'Perfis dos Alunos',
    'modality-by-student': 'PLANO DE TREINAMENTO DE LUTA',
    'student-evaluation': 'Avaliação e Notas dos Alunos',
    'student-attendance': 'Frequência dos Alunos',
    
    // Teachers Sub-items
    'teacher-registration': 'Cadastro de Professores',
    'teacher-profiles': 'Perfis dos Professores',
    'assign-teachers': 'Atribuir Professores às Aulas',
    'teacher-evaluations': 'Avaliações dos Professores',
    
    // Championships Sub-items
    'championship-registration': 'Cadastro de Campeonatos',
    'student-enrollment': 'Inscrição de Alunos em Campeonatos',
    'championship-results': 'Resultados de Campeonatos',
    'ranking-statistics': 'Ranking e Estatísticas',
    
    // Classes Sub-items
    'class-setup': 'Configuração de Aulas por Modalidade',
    'schedule-management': 'Gestão de Horários',
    'check-in-attendance': 'Check-In / Controle de Frequência',
    'class-capacity': 'Capacidade e Limites das Aulas',
    
    // Fight Plans Sub-items
    'plan-templates': 'Modelos de Planos',
    'assign-plans': 'Atribuir Planos aos Alunos',
    'training-phases': 'Fases de Treinamento e Marcos',
    
    // Quality & Evaluation Sub-items
    'progress-reports': 'Relatórios de Progresso dos Alunos',
    'teacher-feedback': 'Feedback dos Professores',
    'fitness-tests': 'Testes de Condicionamento e Métricas',
    
    // Branches Sub-items
    'branch-registration': 'Cadastro de Filiais',
    'branch-details': 'Detalhes da Filial (localização, contato)',
    'assign-branch': 'Atribuir Alunos/Professores por Filial',
    'branch-schedules': 'Horários da Filial',
    'branch-facilities': 'Instalações da Filial',
    'branch-reports': 'Relatórios da Filial',
    
    // Schedules & Check-Ins Sub-items
    'weekly-timetable': 'Cronograma Semanal',
    'booking-system': 'Sistema de Reservas dos Alunos',
    'attendance-log': 'Log de Frequência em Tempo Real',
    
    // Administration Sub-items
    'user-profiles': 'Perfis de Usuário e Funções',
    'language-selector': 'Seletor de Idioma',
    'app-settings': 'Configurações do App',
    
    // Common
    'dashboard': 'Painel',
    'academy-manager': 'Gerenciador da Academia',
    'management-system': 'Sistema de Gestão',
    'welcome-message': 'Bem-vindo ao seu Sistema de Gestão da Academia de Jiu-Jitsu - UI Moderna Implantada! 🚀',
    'total-students': 'Total de Alunos',
    'active-students': 'Alunos Ativos',
    'black-belts': 'Faixas Pretas',
    'belt-level-counts': 'Contagem por Faixa',
    'white-belts': 'Faixas Brancas',
    'blue-belts': 'Faixas Azuis',
    'purple-belts': 'Faixas Roxas',
    'brown-belts': 'Faixas Marrons',
    'export-to-excel': 'Exportar para Excel',
    'export-students': 'Exportar Alunos',
    'import-from-excel': 'Importar do Excel',
    'import-students': 'Importar Alunos',
    'select-excel-file': 'Selecionar Arquivo Excel',
    'import-success': 'Importação Bem-sucedida',
    'import-error': 'Erro na Importação',
    'imported-students': 'Alunos Importados',
    'import-summary': 'Resumo da Importação',
    'file-format-help': 'Ajuda com Formato do Arquivo',
    'download-template': 'Baixar Modelo',
    'filter-students': 'Filtrar Alunos',
    'search-students': 'Buscar Alunos',
    'filter-by-belt': 'Filtrar por Faixa',
    'filter-by-gender': 'Filtrar por Gênero',
    'filter-by-status': 'Filtrar por Status',
    'all-belts': 'Todas as Faixas',
    'all-genders': 'Todos os Gêneros',
    'all-status': 'Todos os Status',
    'clear-filters': 'Limpar Filtros',
    'active-only': 'Apenas Ativos',
    'inactive-only': 'Apenas Inativos',
    'student-modality-management': 'Gestão de Modalidades por Aluno',
    'student-modality-connections': 'Conexões de Modalidades por Aluno',
    'assign-modalities': 'Atribuir Modalidades',
    'student-modality': 'Modalidade do Aluno',
    'assigned-modalities': 'Modalidades Atribuídas',
    'modality-assignment': 'Atribuição de Modalidade',
    'select-student': 'Selecionar Aluno',
    'select-modalities': 'Selecionar Modalidades',
    'assignment-date': 'Data de Atribuição',
    'instructors': 'Instrutores',
    'recent-activity': 'Atividade Recente',
    'no-recent-activity': 'Nenhuma atividade recente',
    'start-adding': 'Comece adicionando alunos ou instrutores',
    'quick-actions': 'Ações Rápidas',
    'add-new-student': 'Adicionar Novo Aluno',
    'add-new-instructor': 'Adicionar Novo Instrutor',
    'add-martial-art-type': 'Adicionar Tipo de Arte Marcial',
    'welcome-admin': 'Bem-vindo de volta, Admin',
    'language': 'Idioma',
    'select-language': 'Selecionar Idioma',
    'portuguese': 'Português',
    'english': 'Inglês',
    'save-settings': 'Salvar Configurações',
    'settings-saved': 'Configurações salvas com sucesso!'
  },
  GER: {
    // Main Menu Items
    'students': 'Schüler',
    'teachers': 'Lehrer',
    'championships': 'Meisterschaften',
    'classes': 'Klassen',
    'fight-plans': 'Kampfpläne',
    'fight-modalities': 'Kampfmodalitäten',
    'quality-evaluation': 'Qualität & Bewertung',
    'branches': 'Zweigstellen',
    'schedules-checkins': 'Zeitpläne & Check-ins',
    'administration': 'Administration',
    'dashboard': 'Dashboard',
    'management-system': 'Verwaltungssystem',
    'welcome-message': 'Willkommen zu Ihrem Jiu-Jitsu-Akademie-Verwaltungssystem - Moderne UI bereitgestellt!',
    'welcome-admin': 'Willkommen zurück, Admin',
    'total-students': 'Gesamte Schüler',
    'instructors': 'Ausbilder',
    'recent-activity': 'Letzte Aktivität',
    'quick-actions': 'Schnellaktionen',
    'add-new-student': 'Neuen Schüler hinzufügen',
    'add-new-instructor': 'Neuen Ausbilder hinzufügen',
    'add-martial-art-type': 'Kampfkunsttyp hinzufügen',
    'no-recent-activity': 'Keine letzte Aktivität',
    'start-adding': 'Beginnen Sie mit dem Hinzufügen von Schülern oder Ausbildern',
    'save-settings': 'Einstellungen speichern',
    'settings-saved': 'Einstellungen erfolgreich gespeichert!'
  },
  FRA: {
    // Main Menu Items
    'students': 'Étudiants',
    'teachers': 'Professeurs',
    'championships': 'Championnats',
    'classes': 'Classes',
    'fight-plans': 'Plans de Combat',
    'fight-modalities': 'Modalités de Combat',
    'quality-evaluation': 'Qualité & Évaluation',
    'branches': 'Succursales',
    'schedules-checkins': 'Horaires & Enregistrements',
    'administration': 'Administration',
    'dashboard': 'Tableau de Bord',
    'management-system': 'Système de Gestion',
    'welcome-message': 'Bienvenue dans votre Système de Gestion d\'Académie de Jiu-Jitsu - Interface Moderne Déployée!',
    'welcome-admin': 'Bon retour, Admin',
    'total-students': 'Total des Étudiants',
    'instructors': 'Instructeurs',
    'recent-activity': 'Activité Récente',
    'quick-actions': 'Actions Rapides',
    'add-new-student': 'Ajouter un Nouvel Étudiant',
    'add-new-instructor': 'Ajouter un Nouvel Instructeur',
    'add-martial-art-type': 'Ajouter un Type d\'Art Martial',
    'no-recent-activity': 'Aucune activité récente',
    'start-adding': 'Commencez par ajouter des étudiants ou des instructeurs',
    'save-settings': 'Enregistrer les Paramètres',
    'settings-saved': 'Paramètres enregistrés avec succès!'
  },
  ESP: {
    // Main Menu Items
    'students': 'Estudiantes',
    'teachers': 'Profesores',
    'championships': 'Campeonatos',
    'classes': 'Clases',
    'fight-plans': 'Planes de Lucha',
    'fight-modalities': 'Modalidades de Lucha',
    'quality-evaluation': 'Calidad & Evaluación',
    'branches': 'Sucursales',
    'schedules-checkins': 'Horarios & Registros',
    'administration': 'Administración',
    'dashboard': 'Panel de Control',
    'management-system': 'Sistema de Gestión',
    'welcome-message': '¡Bienvenido a tu Sistema de Gestión de Academia de Jiu-Jitsu - Interfaz Moderna Desplegada!',
    'welcome-admin': 'Bienvenido de vuelta, Admin',
    'total-students': 'Total de Estudiantes',
    'instructors': 'Instructores',
    'recent-activity': 'Actividad Reciente',
    'quick-actions': 'Acciones Rápidas',
    'add-new-student': 'Agregar Nuevo Estudiante',
    'add-new-instructor': 'Agregar Nuevo Instructor',
    'add-martial-art-type': 'Agregar Tipo de Arte Marcial',
    'no-recent-activity': 'Sin actividad reciente',
    'start-adding': 'Comience agregando estudiantes o instructores',
    'save-settings': 'Guardar Configuración',
    'settings-saved': '¡Configuración guardada exitosamente!'
  }
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('PTB')

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('academy-language') as Language
    if (savedLanguage && ['ENU', 'PTB', 'GER', 'FRA', 'ESP'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when changed
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('academy-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
