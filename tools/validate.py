"""Validate the maintainable catalog without third-party dependencies."""
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


def validate():
    games = json.loads((ROOT / 'games.json').read_text(encoding='utf-8'))
    assert isinstance(games, list), 'games.json must be a list'
    ids = set()
    required = ['id', 'title', 'category', 'description', 'url', 'cover',
                'coverAlt', 'deviceLabel', 'deviceNote']
    for game in games:
        for key in required:
            assert isinstance(game.get(key), str) and game[key].strip(), f'Missing {key}'
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', game['id']), 'Invalid id'
        assert game['id'] not in ids, f'Duplicate id: {game["id"]}'
        ids.add(game['id'])
        url = urlparse(game['url'])
        assert url.scheme == 'https' and url.netloc, f'Invalid HTTPS URL: {game["id"]}'
        cover = (ROOT / game['cover']).resolve()
        assert cover.is_relative_to(ROOT / 'assets' / 'games'), 'Cover must be in assets/games'
        assert cover.is_file(), f'Missing cover: {game["cover"]}'
        assert cover.stat().st_size > 0, f'Empty cover: {game["cover"]}'
        assert isinstance(game.get('devices'), list) and game['devices'], 'Missing devices'
        assert all(d in ('phone', 'tablet', 'desktop') for d in game['devices']), 'Unknown device'
        assert game.get('accent') in ('gold', 'cyan', 'violet'), 'Unknown accent'
        assert type(game.get('published')) is bool, 'published must be boolean'
        assert type(game.get('order')) is int, 'order must be integer'
    for name in ['index.html', 'styles.css', 'app.js', 'assets/favicon.svg']:
        assert (ROOT / name).is_file(), f'Missing {name}'
    print(f'PASS: {len(games)} games, unique IDs, HTTPS links, covers, device labels, and site assets.')


if __name__ == '__main__':
    validate()
