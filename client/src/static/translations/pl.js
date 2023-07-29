const pl = {
    // General
    edit: 'Edytuj',
    delete: 'Usuń',
    cancel: 'Anuluj',
    assign: 'Przypisz',
    detach: 'Odłącz',
    search: 'Szukaj',
    back: 'Powrót',
    join: 'Dołącz',
    accept: 'Akceptuj',
    reject: 'Odrzuć',
    confirm: 'Zatwierdź',
    next: 'Dalej',
    close: 'Zamknij',
    error: 'Coś poszło nie tak... Prosimy spróbować później',

    // Homepage
    topMenu: ['Home', 'Moje pliki', 'Moje schematy', 'Nowe dopasowanie', 'Zespół'],
    topDropdownMenu: ['Zmień hasło', 'Wyloguj się'],
    mainMenu: ['Moje pliki', 'Moje schematy dopasowania', 'Utwórz nowe dopasowanie', 'Zarządzaj zespołem i użytkownikami'],

    // Files page
    yourFiles: 'Twoje pliki',
    teamFiles: 'Pliki zespołu',
    addFile: 'Dodaj plik',
    addNewFile: 'Dodaj nowy plik',
    filesTableHeader: ['Nazwa pliku', 'Data uploadu', 'Ilość wierszy', 'Rozmiar pliku', 'Edycja'],
    makeTeamFileOwner: 'Uczyń zespół właścicielem pliku',
    fileName: 'Nazwa pliku',
    deleteFileModalAlert: 'Czy na pewno chcesz usunąć ten plik?',
    makeTeamFileOwnerAlert: 'Pamiętaj o tym! Jeśli uczynisz Twój zespół właścicielem tego pliku, to będziesz posiadać do niego dostęp tylko gdy jesteś członkiem tego zespołu. Dzięki temu podejściu zespół nie musi martwić się o osoby odchodzące z zespołu i utworzone przez nich pliki. Pliki zespołu zawsze zostają w zespole. Jeżeli Twoje uprawnienia w zespole są ograniczone (np. nie możesz edytować lub usuwać schematów) - to utracisz tą możliwość po zmianie właścicielstwa.',
    filePreview: 'Podgląd pliku',
    clickEditToConfirm: 'Kliknij "Edytuj", aby zatwierdzić zmiany',
    makeTeamFileOwnerDone: 'Plik został przypisany do zespołu',
    deleteFileDone: 'Plik został usunięty',
    noRightsForFileEdition: 'Nie posiadasz praw do edycji pliku',

    // Schemas page
    yourSchemas: 'Twoje schematy dopasowania',
    teamSchemas: 'Schematy dopasowania zespołu',
    schemasTableHeader: ['Nazwa schematu', 'Data utworzenia', 'Edycja', 'Zwiń/Rozwiń'],
    makeTeamSchemaOwner: 'Uczyń zespół właścicielem schematu',
    deleteSchemaAlert: 'Czy na pewno chcesz usunąć ten schemat?',
    makeTeamSchemaOwnerAlert: 'Uwaga! Jeśli uczynisz Twój zespół właścicielem, to będziesz posiadać dostęp do tego schematu, gdy tylko przestaniesz być członkiem tego zespołu. Dzięki temu podejściu zespół nie musi martwić się o osoby odchodzące z zespołu i utworzone przez nich pliki. Jeżeli Twoje uprawnienia w zespole są ograniczone (np. nie możesz edytować lub usuwać schematów) - to utracisz tą możliwość po zmianie właścicielstwa.',
    showSheets: 'rozwiń arkusze',
    hideSheets: 'zwiń arkusze',
    schemasTableSheetsHeader: ['arkusz 1', 'arkusz 2', 'ilość rekordów w arkuszu 1 z dopasowaniem do arkusza 2', 'ilość rekordów w arkuszu 2 z dopasowaniem do arkusza 1', 'opcje'],
    runEditor: 'Uruchom edytor',
    addNewSheetsToSchema: 'Dodaj nowe arkusze do schematu',
    detachFilesFromSchemaAlert: 'Czy na pewno chcesz odłączyć te pliki od tego schematu?',
    assignSheetsToSchema: 'Przypisz arkusze do schematu',
    schemaDeleteDone: 'Schemat został usunięty',
    makeTeamSchemaOwnerDone: 'Schemat został przypisany do zespołu',
    detachFilesFromSchemaDone: 'Pliki zostały odłączone od schematu',
    filesAssignToSchemaDone: 'Pliki zostały przypisane do schematu',
    outOf: 'z',
    noSheetsAssignedToSchema: 'Nie masz jeszcze żadnych arkuszy przypisanych do tego schematu',
    noSchemasFound: 'Nie masz żadnych schematów dopasowania',

    // Correlation page
    loadSheets: 'Wczytaj arkusze',
    loadSheet1Text: 'Dodaj plik źródłowy, do którego będziesz relacjonować - np. arkusz z towarami.',
    loadSheet2Text: 'Dodaj plik źródłowy, z którego pobierzesz interesujące Cię kolumny uprzednio relacjonując do nich rekordy z pliku pierwszego (np. arkusz z cenami/ kodami kreskowymi itd.)',
    chooseSheetPlaceholder: 'Wybierz arkusz',
    loadFileError: 'Nie udało się dodać plików. Pamiętaj, aby pliki były zapisane w formacie .csv lub .txt',
    chooseSchemaLabel: 'Skorzystaj z uprzednio utworzonego schematu dopasowania',
    chooseSchemaPlaceholder: 'Wybierz schemat',
    runMatchingButton: 'Przejdź do korelacji rekordów',
    fileAdded: 'Plik został dodany',
    fileEdited: 'Plik został pomyślnie zaktualizowany',
    currentSchema: 'Aktualny schemat dopasowania',
    schemaNamePlaceholder: 'Nazwa schematu dopasowania',
    createAndSaveSchema: 'Utwórz i zapisz schemat',
    updateSchema: 'Zapisz zmiany w schemacie',
    schemaTooltip: 'Schemat dopasowania pozwala zapisać sposób dopasowania rekordów w arkuszu 1 do arkusza 2 - zarówno dopasowań automatycznych, ręcznych, jak i wyboru użytkownika spośród tych automatycznie wygenerowanych propozycji przez system. Jest to bardzo przydatna funkcja, jeżeli przynajmniej więcej niż raz będziesz dopasowywać podobne arkusze do siebie, a już na wagę złota gdy czynisz to regularnie (np. regularnie wprowadzasz dostawy od danego dostawcy/ porównujesz ceny od danego dostawcy/ czy generalnie korzystasz z tych samych lub zbliżonych plików wejściowych). Co istotne - jeśli pliki będą się różnić bo np. zostały zaktualizowane i doszły lub usunięto jakieś wiersze - nie ma problemu! aplikacja również sobie z tym poradzi!',
    sheet1: 'Arkusz 1',
    sheet2: 'Arkusz 2',
    outputSheet: 'Arkusz wyjściowy',
    loadedFile: 'Wczytany plik',
    relationType: 'Typ relacji',
    relationTypePlaceholder: 'Typ dopasowania',
    relationTypes: ['Jeden do jednego', 'Jeden (arkusz 1) do wielu (arkusz 2)', 'Wiele (arkusz 1) do jednego (arkusz 2)', 'Wiele do wielu'],
    autoMatchButton: 'Automatycznie dopasuj',
    matchesDone: 'Wykonane dopasowania',
    exportOutputSheet: 'Eksportuj arkusz wyjściowy',
    relationColumn: 'Kolumna relacji',
    addRelationColumn: 'Dodaj relację',
    notRestrictCellsHeight: 'nie ograniczaj wysokości komórek',
    restrictCellsHeight: 'ograniczaj wysokość komórek do:',
    schemaAdded: 'Schemat został dodany',
    schemaUpdated: 'Schemat został zaktualizowany',
    newSchema: 'nowy schemat',
    deleteAllMatchesModalAlert: 'Uwaga! Czy na pewno chcesz usunąć wszystkie dopasowania?',
    deleteMatches: 'Usuń dopasowania',
    overrideMatchAlert: 'Rekord jest już przypisany. Czy na pewno chcesz nadpisać przypisanie?',
    overrideMatch: 'Nadpisz przypisanie',
    noColumnsInSelectMenuAlert: 'Uwaga! Żadne kolumny nie są wskazane w drugim arkuszu jako mające się wyświetlać w podpowiadajce, dlatego wiersze poniżej są puste.',
    leaveCorrelationPageAlert: 'Czy na pewno chcesz opuścić tę stronę?',
    numberOfRecords: 'Liczba rekordów',

    // Correlation table
    visibility: 'Widoczność',
    columnVisibility: 'Widoczność kolumn',
    index: 'l.p.',
    dataSheetIndex: 'l.p. arkusza 1',
    relationSheetIndex: 'l.p. arkusza 2',
    configureInWindow: 'Konfiguruj w okienku',
    formatCellsVisibility: 'Formatuj widoczność komórek',
    checkAll: 'Zaznacz wszystkie',
    uncheckAll: 'Odznacz wszystkie',
    showInSelectMenu: 'Pokazuj w podpowiadajce',
    includeInExport: 'Uwzględnij w eksporcie',
    setVisibility: 'Ustaw widoczność',
    sortByUnmatched: 'Sortuj wg nieprzydzielonych',
    sortByMatched: 'Sortuj wg przydzielonych',
    relationColumnHeaders: ['Rekord z ark. 1, z którym powiązano rekord', 'Rekord z ark. 1, z którym powiązano rekord'],
    turnOnColorOnStrings: 'Włącz zaznaczanie dopasowanych fragmentów',
    turnOffColorOnStrings: 'Wyłącz zaznaczanie dopasowanych fragmentów',
    matchCounterDataSheetName: 'ilość dopasowań ark1 do ark2',
    matchCounterRelationSheetName: 'ilość dopasowań ark2 do ark1',
    showAll: 'zobacz wszystko',
    saveAndReturnToExternalApp: 'Zapisz i cofnij do nadrzędnej aplikacji',
    rowWithLargerMatchAlert: 'Znaleziono wiersz o większym dopasowaniu, jednak został on już przypisany do innego rekordu',
    deleteAllMatches: 'Usuń wszystkie dopasowania',
    selectListTooltip: ['Skorzystaj z konfiguracji arkusza 2 i wskaż wartość których kolumn ma się tutaj wyświetlać, aby pomóc Tobie zidentyfikować dane wiersze z danymi z arkusza 2.', 'Skorzystaj z konfiguracji arkusza 1 i wskaż wartość których kolumn ma się tutaj wyświetlać, aby pomóc Tobie zidentyfikować dane wiersze z danymi z arkusza 1.'],

    // Auto match modal
    testConfiguration: 'Przetestuj konfiguracje',
    matchSteps: 'Kroki dopasowania',
    addStep: 'Dodaj krok',
    addCondition: 'Dodaj warunek',
    autoMatchModalInfo: 'Po wykonaniu automatycznego dopasowania - wciąż będziesz mógł samodzielnie zmienić dopasowanie. Dodatkowo system oznaczy kolorami dokładność dopasowania.',
    autoMatchModalOptions: ['dopasuj tylko te rekordy, które jeszcze nie mają żadnego dopasowania', 'nadpisz wszystkie rekordy, jeśli znajdziesz nowe dopasowanie', 'pomiń (nie nadpisuj) skorelowania przypisane ręcznie'],
    runAutoMatch: 'Uruchom automatyczne dopasowanie',
    step: 'Krok',
    condition: 'Warunek',
    minimumConditionsRequired: 'Minimalna ilość warunków, które muszą spełniać próg procentowy % aby krok uznać za spełniony:',
    searchInSheet1Label: 'Szukaj dopasowania w kolumnie arkusza 1',
    searchInSheet2Label: 'Szukaj dopasowania w kolumnie arkusza 2',
    columnsNotFound: 'Nie znaleziono żadnych kolumn',
    matchFunctionLabel: 'Funkcja dopasowania',
    matchFunctionOptions: ['Dopasowanie stringów',
        'Pokrycie wartości z ark. 1 w ark. 2', 'Pokrycie wartości z ark. 2 w ark. 1'],
    matchThresholdLabel: 'Przypisuj, jeśli dopasowanie procentowe jest większe niż:',
    matchConditionRequiredLabel: 'warunek jest',
    matchConditionRequiredOptions: ['wymagany', 'opcjonalny'],
    closeTesting: 'Zamknij testowanie',
    numberOfRow: 'numer wiersza',
    selectRecordByColumnValueLabel: 'Wskaż rekord wg wartości w kolumnie',
    valueInColumnPlaceholder: 'Wartość w kolumnie',
    rowAnyNotFound: 'Nie znaleziono żadnego wiersza',
    rowNotFound: 'Nie ma takiego wiersza. Liczba wierszy w arkuszu: ',
    runTestMatchingButton: 'Uruchom automatyczne dopasowanie testowo tylko dla wiersza powyżej',
    testingMatchNotFound: 'Nie znaleziono dopasowania powyżej wyznaczonego progu. Poniżej znajduje się lista dziesięciu najwyżej dopasowanych rekordów.',
    testingMatchFoundHeaderPart1: 'Znaleziono dopasowanie do wiersza nr ',
    testingMatchFoundHeaderPart2: 'z arkusza 2',
    testingMatchFoundListHeader: 'Poniżej znajduje się lista pozostałych dziesiąciu najwyżej dopasowanych rekordów',
    match: 'Dopasowanie',
    autoMatchProgress: ['Trwa przesyłanie wyników na serwer', 'Trwa korelowanie rekordów', 'Trwa przesyłanie wyników'],

    // Export settings modal
    exportSettings: 'Ustawienia eksportu',
    exportFormatLabel: 'Format wyjściowy',
    exportFormatOptions: ['.csv rozdzielony przecinkiem', '.csv rozdzielony średnikiem', 'obiekt JSON'],
    duplicatedRecordsFormatLabel: 'Formatowanie zduplikowanych rekordów (w wyniku relacji wiele do...)',
    duplicatedRecordsFormatOptions: ['eksportuj duplikaty rekordów', 'zawsze separuj przecinkiem', 'sumuj wartości lub separuj przecinkiem'],
    exportBuildSystemLabel: 'Arkusz wyjściowy buduj z',
    exportBuildSystemOptions: ['Tylko dopasowanych rekordów', 'Wszystkie rekordy z arkusza 1', 'Wszystkie rekordy z arkusz 2'],
    includeColumnWithMatchCounterLabel: 'Dodaj kolumnę wskazującą ilość dopasowań dla danego rekordu',
    columnsToSumLabel: 'Wskaż kolumny, które należy sumować',
    apiModeSchemaNotCreatedAlert: 'Pamiętaj, że możesz stworzyć schemat i następnym razem skorelować dane szybciej',
    apiModeAlertDismissButton: 'Zapisz mimo to',
    apiModeSchemaNotSavedAlert: 'Schemat nie został zaktualizowany, zaktualizować go również? Jeśli nie, to wynik prac zostanie zachowany, ale już ustawienia widoczności i parametry auto dopasowania - nie',
    dataSendToExternalAppDone: 'Dane zostały wysłane do nadrzędnej aplikacji',

    // Team page
    yourTeam: 'Twój zespół',
    leaveTeam: 'Opuść zespół',
    deleteTeam: 'Usuń zespół',
    rightsUpdated: 'Prawa zostały zaktualizowane',
    leaveTeamModalAlert: 'Uwaga! odłączając się od zespołu - wszystkie pliki i schematy, które utworzyłeś i dodałeś jako dostępne dla zespołu pozostaną w nim i nie będą już dla Ciebie dostępne',
    deleteTeamModalAlert: 'Uwaga! Usuwając zespół przypiszesz wszystkie pliki i schematy dopasowania z powrotem do Twojego profilu.',
    teamIdInfo: 'Podaj ten numer członkom swojego zespołu, aby mogli się do niego dodać',
    teamTableHeader: ['Email', 'Pliki usera', 'Schematy dopasowania usera', 'Wykorzystanych auto dopasowań w tym miesiącu', 'Może edytować pliki zespołu', 'Może usuwać pliki zespołu', 'Może edytować schematy dopasowania zespołu', 'Może usuwać schematy dopasowania zespołu'],
    joinTeamRequestsHeader: 'Prośby dodania do zespołu',
    noJoinTeamRequestsInfo: 'Nie masz żadnych oczekujących próśb o dołączenie do zespołu',
    editName: 'Zmień nazwę',
    notInTeamHeader: 'Nie należysz do żadnego zespołu',
    createNewTeam: 'Stwórz nowy zespół',
    joinTeam: 'Dołącz do zespołu',
    teamName: 'Nazwa zespołu',
    teamId: 'id zespołu',
    teamCreatedHeader: 'Udało się utworzyć Twój zespół!',
    manageTeam: 'Zarządzaj zespołem',
    backHomepage: 'Wróć na stronę główną',
    deleteTeamInfo: 'Usunąłeś swój zespół. Możesz teraz dołączyć do innego zespołu lub utworzyć nowy zespół.',
    leaveTeamInfo: 'Opuściłeś zespół. Możesz teraz dołączyć do innego zespołu lub utworzyć nowy zespół.',
    joinTeamRequestSendInfo: 'Zgłoszenie do zespołu zostało wysłane. Po akceptacji przez właściciela dołączysz do zespołu.',
    joinTeamRequestHeaderPart1: 'Twoje zgłoszenie do zespołu',
    joinTeamRequestHeaderPart2: 'czeka na akceptację właściciela',
    joinTeamRequestSubheader: 'Poinformujemy Cię, gdy Twoje zgłoszenie zostanie zaakceptowane',
    cancelJoinTeamRequest: 'Cofnij zgłoszenie',
    cancelJoinTeamRequestModalAlert: 'Czy na pewno chcesz cofnąć to zgłoszenie?',
    teamNameAlreadyTaken: 'Podana nazwa jest już zajęta',
    youCanNotLeaveTeam: 'Nie możesz opuścić zespołu, ponieważ jesteś jego właścicielem',

    // Change password
    changePassword: 'Zmień hasło',
    currentPassword: 'Aktualne hasło',
    newPassword: 'Nowe hasło',
    repeatNewPassword: 'Powtórz nowe hasło',
    password: 'Hasło',
    repeatPassword: 'Powtórz hasło',
    passwordChanged: 'Twoje hasło zostało zmienione',
    homepage: 'Strona główna',
    oldPasswordIncorrectError: 'Niepoprawne stare hasło',
    passwordsIdenticalError: 'Podane hasła nie są identyczne',
    passwordWeakError: 'Hasło musi mieć co najmniej 8 znaków, zawierać co najmniej jedną wielką literę oraz jedną cyfrę',

    // Login page
    login: 'Zaloguj się',
    doNotHaveAccount: 'Nie masz konta?',
    email: 'Adres e-mail',
    loginError: 'Niepoprawny adres e-mail lub hasło',

    // Register page
    register: 'Zarejestruj się',
    createAccount: 'Załóż konto',
    emailAlreadyTakenError: 'Użytkownik o podanym adresie e-mail już istnieje',
    registerCheckboxError: 'Akceptuj postanowienia polityki prywatności',
    registerCheckbox: 'Wyrażam zgodę na przetwarzanie danych osobowych przez RowMatcher.com',
    registerEmailError: 'Podaj poprawny adres e-mail',
    accountVerified: 'Twoje konto zostało pomyślnie zweryfikowane',
    registerSuccess: 'Rejestracja przebiegła pomyślnie! Na Twój adres e-mail wysłaliśmy link aktywacyjny. Kliknij w niego i korzystaj z RowMatcher.com!'
}

export default pl;
