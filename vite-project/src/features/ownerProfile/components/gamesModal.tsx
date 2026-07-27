import { useState } from "react";
import { type Game, useGamesWindow } from "../hooks/useGamesModal";

interface Driveway {
  _id: string;
  name: string;
  address: string;
  images: string[];
  walk: string;
  price: string;
  description: string;
  rules: string[]
}

interface Props {
    onClose: () => void;
    driveway: Driveway;
}

export type { Driveway };

export function GamesWindow({ onClose, driveway }: Props) {
    const [pendingGame, setPendingGame] = useState<Game | null>(null);
    const {
        games,
        isLoading,
        error,
        actionError,
        loadingGameDate,
        retryFetchGames,
        toggleGameAvailability,
    } = useGamesWindow(driveway._id);

    function handleStatusClick(game: Game) {
        if (game.booked) {
            return;
        }

        setPendingGame(game);
    }

    function closeConfirmPopup() {
        if (pendingGame && loadingGameDate === pendingGame.date) {
            return;
        }

        setPendingGame(null);
    }

    async function confirmToggle() {
        if (!pendingGame) {
            return;
        }

        await toggleGameAvailability(pendingGame);
        setPendingGame(null);
    }

    const isConfirmLoading = Boolean(pendingGame && loadingGameDate === pendingGame.date);

    function getConfirmTitle() {
        if (!pendingGame) {
            return "Update booking availability";
        }

        return pendingGame.blocked ? "Unblock this game?" : "Block this game?";
    }

    function getConfirmDescription() {
        if (!pendingGame) {
            return "";
        }

        return pendingGame.blocked
            ? `Unblock ${pendingGame.date}?`
            : `Block ${pendingGame.date}?`;
    }

    return (
        <div className="games-modal" role="dialog" aria-modal="true" aria-labelledby="games-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="games-modal-header">
                <div className="games-modal-title-wrap">
                    <h3 id="games-modal-title">{driveway.name}</h3>
                    <p className="games-modal-address">{driveway.address}</p>
                </div>
                <button type="button" className="games-modal-close" onClick={onClose} aria-label="Close bookings window">
                    X
                </button>
            </div>

            <div className="games-modal-body">
                <div className="info-banner games-modal-tip">
                    <p>Click on <strong>Available</strong> or <strong>Blocked</strong> to block or unblock bookings for that game.</p>
                </div>

                <div className="games-modal-games">
                    <h4 className="games-modal-section-title">Games</h4>
                    {isLoading ? (
                        <p>Loading games...</p>
                    ) : error ? (
                        <div className="error-message games-modal-error">
                            <p>{error}</p>
                            <button type="button" className="retry-btn" onClick={() => void retryFetchGames()}>
                                Try Again
                            </button>
                        </div>
                    ) : games.length > 0 ? (
                        <div>
                            {actionError && <p className="games-modal-action-error">{actionError}</p>}
                            <ul className="games-list">
                                {games.map((game) => (
                                    <li className="gameRow2" key={`${driveway._id}-${game.date}-${game.game_time}-${game.visiting_team}`}>
                                        <div className="gameData">
                                            <div className="gameData-main">
                                                <span className="game-date">{game.date}</span>
                                                <span className="game-time">@ {game.game_time}</span>
                                            </div>
                                            <div className="gameData-team">
                                                <span className="game-vs">vs</span>
                                                <span className="game-team">{game.visiting_team}</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={game.booked || loadingGameDate === game.date}
                                            className={`game-status ${
                                                game.booked ? "booked" : game.blocked ? "blocked" : "available"
                                            }`}
                                            onClick={() => handleStatusClick(game)}
                                        >
                                            {loadingGameDate === game.date
                                                ? "Loading..."
                                                : game.booked
                                                    ? "Booked"
                                                    : game.blocked
                                                        ? "Blocked"
                                                        : "Available"}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p>No games found for this driveway.</p>
                    )}
                </div>
            </div>

            {pendingGame && (
                <div className="games-confirm-overlay" onClick={closeConfirmPopup}>
                    <div className="games-confirm-box" role="alertdialog" aria-modal="true" aria-labelledby="games-confirm-title" onClick={(e) => e.stopPropagation()}>
                        <h4 id="games-confirm-title">{getConfirmTitle()}</h4>
                        <p>{getConfirmDescription()}</p>
                        <div className="games-confirm-actions">
                            <button
                                type="button"
                                className="games-confirm-yes"
                                disabled={isConfirmLoading}
                                onClick={() => void confirmToggle()}
                            >
                                {isConfirmLoading ? "Updating..." : "Yes, continue"}
                            </button>
                            <button
                                type="button"
                                className="games-confirm-no"
                                disabled={isConfirmLoading}
                                onClick={closeConfirmPopup}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}