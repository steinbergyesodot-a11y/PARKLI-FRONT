import { useGamesWindow } from "../hooks/useGamesModal";

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
    const {games} = useGamesWindow(driveway._id)
    return (
        <div className="games-modal" role="dialog" aria-modal="true" aria-labelledby="games-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="games-modal-header">
                <h3 id="games-modal-title">{driveway.name}</h3>
                <button type="button" className="games-modal-close" onClick={onClose} aria-label="Close bookings window">
                    X
                </button>
                  <div className="info-banner">
                    <p>💡 Click on <strong>Available</strong> or <strong>Blocked</strong> to block/unblock bookings for that date.</p>
                  </div>
            </div>

            <div className="games-modal-body">
                <p>
                    <strong>Address:</strong> {driveway.address}
                </p>
                <p>
                    <strong>Price:</strong> {driveway.price}
                </p>
                <p>
                    <strong>Walk:</strong> {driveway.walk}
                </p>
                <p>
                    <strong>Description:</strong> {driveway.description}
                </p>

                <div className="games-modal-rules">
                    <strong>Rules:</strong>
                    {driveway.rules.length > 0 ? (
                        <ul>
                            {driveway.rules.map((rule, index) => (
                                <li key={`${driveway._id}-${index}`}>{rule}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No rules added yet.</p>
                    )}
                </div>

                <div className="games-modal-games">
                    <strong>Games:</strong>
                    {games.length > 0 ? (
                        <ul>
                            {games.map((game) => (
                                <li key={`${driveway._id}-${game.date}-${game.game_time}-${game.visiting_team}`}>
                                    <span>{game.date}</span>{" "}
                                    <span>{game.game_time}</span>{" "}
                                    <span>vs {game.visiting_team}</span>{" "}
                                    <span>{game.blocked ? "Blocked" : game.booked ? "Booked" : "Available"}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No games found for this driveway.</p>
                    )}
                </div>
            </div>
        </div>
    );
}