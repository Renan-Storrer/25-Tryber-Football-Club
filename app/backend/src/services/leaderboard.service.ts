import { ModelStatic } from 'sequelize';
import { grResponse } from '../utils/grResponse';
import {
  rank,
  grResults,
  orderRank,
  grResultsGeneral,
  rankGeneral,
} from '../utils/leaderboardFunctions';
import IResponse from '../interfaces/IResponse';
import Matche from '../database/models/MatcheModel';
import Team from '../database/models/TeamModel';
import ILeaderboard from '../interfaces/ILeaderboard';

class LeaderboardService {
  private _matche: ModelStatic<Matche> = Matche;
  private _team: ModelStatic<Team> = Team;

  async rankHome(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter((el) => el.homeTeamId === e.id);
      const results = grResults(matchesByTeam, ['homeTeamGoals', 'awayTeamGoals']);

      result.push(rank(e, results, matchesByTeam, ['homeTeamGoals', 'awayTeamGoals']));
    });
    return grResponse(200, orderRank(result));
  }

  async rankAway(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter((el) => el.awayTeamId === e.id);
      const results = grResults(matchesByTeam, ['awayTeamGoals', 'homeTeamGoals']);

      result.push(rank(e, results, matchesByTeam, ['awayTeamGoals', 'homeTeamGoals']));
    });
    return grResponse(200, orderRank(result));
  }

  async rankGeral(): Promise<IResponse> {
    const teams = await this._team.findAll();
    const matches = await this._matche.findAll({ where: { inProgress: false } });

    const result: ILeaderboard[] = [];

    teams.forEach((e) => {
      const matchesByTeam = matches.filter(
        (el) => el.awayTeamId === e.id || el.homeTeamId === e.id,
      );
      const results = grResultsGeneral(e.id, matchesByTeam);

      result.push(rankGeneral(e, results, matchesByTeam));
    });
    return grResponse(200, orderRank(result));
  }
}

export default LeaderboardService;
