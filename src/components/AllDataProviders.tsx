import React from 'react';
import { StudentProvider } from '../contexts/StudentContext';
import { TeacherProvider } from '../contexts/TeacherContext';
import { BranchProvider } from '../contexts/BranchContext';
import { WeightDivisionProvider } from '../contexts/WeightDivisionContext';
import { FightModalityProvider } from '../contexts/FightModalityContext';
import { ClassScheduleProvider } from '../contexts/ClassScheduleContext';
import { ChampionshipProvider } from '../contexts/ChampionshipContext';
import { ChampionshipCategoryProvider } from '../contexts/ChampionshipCategoryContext';
import { ChampionshipRegistrationProvider } from '../contexts/ChampionshipRegistrationContext';
import { ChampionshipResultProvider } from '../contexts/ChampionshipResultContext';
import { ChampionshipOfficialProvider } from '../contexts/ChampionshipOfficialContext';
import { ChampionshipSponsorProvider } from '../contexts/ChampionshipSponsorContext';
import { ChampionshipQualifiedLocationProvider } from '../contexts/ChampionshipQualifiedLocationContext';
import { FightAssociationProvider } from '../contexts/FightAssociationContext';
import { FightTeamProvider } from '../contexts/FightTeamContext';
import { FightPhaseProvider } from '../contexts/FightPhaseContext';
import { FightProvider } from '../contexts/FightContext';
import { AffiliationProvider } from '../contexts/AffiliationContext';
import { StudentModalityProvider } from '../contexts/StudentModalityContext';
import { BranchFacilityProvider } from '../contexts/BranchFacilityContext';
import { ClassCheckInProvider } from '../contexts/ClassCheckInContext';

interface AllDataProvidersProps {
  children: React.ReactNode;
}

export function AllDataProviders({ children }: AllDataProvidersProps) {
  console.log('AllDataProviders: Mounting all data providers');
  
  return (
    <StudentProvider>
      <TeacherProvider>
        <BranchProvider>
          <WeightDivisionProvider>
            <FightModalityProvider>
              <ClassScheduleProvider>
                <ChampionshipProvider>
                  <ChampionshipCategoryProvider>
                    <ChampionshipRegistrationProvider>
                      <ChampionshipResultProvider>
                        <ChampionshipOfficialProvider>
                          <ChampionshipSponsorProvider>
                            <ChampionshipQualifiedLocationProvider>
                              <FightAssociationProvider>
                                <FightTeamProvider>
                                  <FightPhaseProvider>
                                    <FightProvider>
                                      <AffiliationProvider>
                                        <StudentModalityProvider>
                                          <BranchFacilityProvider>
                                            <ClassCheckInProvider>
                                              {children}
                                            </ClassCheckInProvider>
                                          </BranchFacilityProvider>
                                        </StudentModalityProvider>
                                      </AffiliationProvider>
                                    </FightProvider>
                                  </FightPhaseProvider>
                                </FightTeamProvider>
                              </FightAssociationProvider>
                            </ChampionshipQualifiedLocationProvider>
                          </ChampionshipSponsorProvider>
                        </ChampionshipOfficialProvider>
                      </ChampionshipResultProvider>
                    </ChampionshipRegistrationProvider>
                  </ChampionshipCategoryProvider>
                </ChampionshipProvider>
              </ClassScheduleProvider>
            </FightModalityProvider>
          </WeightDivisionProvider>
        </BranchProvider>
      </TeacherProvider>
    </StudentProvider>
  );
}
