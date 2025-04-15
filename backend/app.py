from flask import Flask, request, jsonify
from flask_cors import CORS
from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import players
import time

app = Flask(__name__)
CORS(app)

@app.route('/api/shots', methods=['GET'])
def get_shots():
    player_id = request.args.get('playerId')
    season = request.args.get('season', '2023-24')

    # Throttle to avoid rate-limiting
    time.sleep(.2)

    shots = shotchartdetail.ShotChartDetail(
        team_id=0,
        player_id=player_id,
        season_type_all_star='Regular Season',
        season_nullable=season,
        context_measure_simple='FGA'
    )

    data = shots.get_data_frames()[0]
    shots_list = data[['LOC_X', 'LOC_Y', 'SHOT_MADE_FLAG']].to_dict(orient='records')
    return jsonify(shots_list)

@app.route('/api/players', methods=['GET'])
def get_player_id():
    name = request.args.get('name')
    match = players.find_players_by_full_name(name)
    if match:
        print(match)
        return jsonify({'id': match[0]['id']})
    return jsonify({'error': 'Player not found'}), 404


if __name__ == '__main__':
    app.run(debug=True)
