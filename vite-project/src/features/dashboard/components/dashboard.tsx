import { useMemo, useState } from "react";
import { Nav } from "react-bootstrap";
import { FaSlidersH } from "react-icons/fa";
import { useDashboard } from "../hooks/useDashboard";
import { ProfileDropdown } from "../../../components/ProfileDropdown";
import { DrivewayCard } from "./DrivewayCard";
import { DrivewayMap } from "./DrivewayMap";
import '../style/Dashboard.css';

type DashboardFilters = {
  maxPrice: string;
  maxWalk: string;
}

export function Dashboard(){
  const {driveways,loading,errorMessage,message,user,sendHome} = useDashboard();
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<DashboardFilters>({
    maxPrice: "",
    maxWalk: "",
  });
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>({
    maxPrice: "",
    maxWalk: "",
  });

  const priceBounds = useMemo(() => {
    if (driveways.length === 0) {
      return { min: 0, max: 100 };
    }

    const prices = driveways.map((driveway) => driveway.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [driveways]);

  const draftMaxPrice = draftFilters.maxPrice === "" ? priceBounds.max : Number(draftFilters.maxPrice);
  const walkBounds = useMemo(() => {
    if (driveways.length === 0) {
      return { min: 0, max: 30 };
    }

    const walkTimes = driveways.map((driveway) => driveway.walk);
    return {
      min: Math.min(...walkTimes),
      max: Math.max(...walkTimes),
    };
  }, [driveways]);

  const draftMaxWalk = draftFilters.maxWalk === "" ? walkBounds.max : Number(draftFilters.maxWalk);

  const filteredDriveways = useMemo(() => {
    const maxPrice = draftNumber(appliedFilters.maxPrice);
    const maxWalk = draftNumber(appliedFilters.maxWalk);

    return driveways.filter((driveway) => {
      if (maxPrice !== null && driveway.price > maxPrice) {
        return false;
      }

      if (maxWalk !== null && driveway.walk > maxWalk) {
        return false;
      }

      return true;
    });
  }, [appliedFilters, driveways]);

  function draftNumber(value: string) {
    if (value.trim() === "") {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isNaN(parsedValue) ? null : parsedValue;
  }

  function handleFilterChange(field: keyof DashboardFilters, value: string) {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleMaxPriceChange(value: string) {
    const nextMaxPrice = Number(value);

    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      maxPrice: String(nextMaxPrice),
    }));
  }

  function handleMaxWalkChange(value: string) {
    const nextMaxWalk = Number(value);

    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      maxWalk: String(nextMaxWalk),
    }));
  }

  function applyFilters() {
    setAppliedFilters(draftFilters);
  }

  function clearFilters() {
    const emptyFilters = { maxPrice: "", maxWalk: "" };
    setDraftFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
  }

  function toggleFilterPanel() {
    setIsFilterPanelOpen((isOpen) => !isOpen);
  }
    
    return (
        <>
        <div className="app-container">
            <div className="topDashboard">
                <img
                src="/logo.png"
                alt="logo"
                className="logoDash"
                onClick={sendHome}
                />
                <Nav className="topRightCornerDashboard">
                {user && <ProfileDropdown />}
                </Nav>
            </div>

                {(message || errorMessage) && (
        <div className="dashboard-error-alert">
          <span className="alert-icon">⚠️</span>
          <span>{message || errorMessage}</span>
        </div>
      )}
          <section className="dashboard-wrapper">
              {/* LEFT SIDE — SCROLLABLE LIST */}
              <div className="dashboard-section">
                <div className="dashboard-controls">
                  <div className="dashboard-filters-header">
                  </div>

                  <button
                    type="button"
                    className="dashboard-filter-toggle"
                    onClick={toggleFilterPanel}
                    aria-expanded={isFilterPanelOpen}
                  >
                    <FaSlidersH aria-hidden="true" />
                    <span>Filters</span>
                  </button>
                </div>

                {isFilterPanelOpen && (
                  <div className="dashboard-filters">
                    <div className="dashboard-filters-grid">
                      <label className="dashboard-filter-field">
                        <span>Max price</span>
                        <div className="dashboard-price-range">
                          <div className="dashboard-price-values">
                            <span>${priceBounds.min}</span>
                            <span>${draftMaxPrice}</span>
                          </div>

                          <div className="dashboard-price-sliders">
                            <input
                              type="range"
                              min={priceBounds.min}
                              max={priceBounds.max}
                              step="1"
                              value={draftMaxPrice}
                              onChange={(event) => handleMaxPriceChange(event.target.value)}
                              aria-label="Maximum price"
                            />
                          </div>
                        </div>
                      </label>

                      <label className="dashboard-filter-field">
                        <span>Walk up to</span>
                        <div className="dashboard-price-range">
                          <div className="dashboard-price-values">
                            <span>{walkBounds.min} min</span>
                            <span>{draftMaxWalk} min</span>
                          </div>

                          <div className="dashboard-price-sliders">
                            <input
                              type="range"
                              min={walkBounds.min}
                              max={walkBounds.max}
                              step="1"
                              value={draftMaxWalk}
                              onChange={(event) => handleMaxWalkChange(event.target.value)}
                              aria-label="Maximum walking time"
                            />
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="dashboard-filter-actions">
                      <button type="button" className="dashboard-filter-apply" onClick={applyFilters}>
                        Apply
                      </button>
                      <button type="button" className="dashboard-filter-clear" onClick={clearFilters}>
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}

                <section className="dashboard">
                {loading ? (
                  <div className="dashboard-loading-state">
                    <div className="dashboard-spinner" aria-hidden="true"></div>
                    <div>Loading driveways…</div>
                  </div>
                ) : filteredDriveways.length === 0 ? (
                  <div className="dashboard-empty-state">
                    <div>No driveways match these filters.</div>
                    <button type="button" className="dashboard-filter-clear" onClick={clearFilters}>
                      Clear filters
                    </button>
                  </div>
                ) : (
                  filteredDriveways.map((driveway) => (
                    <DrivewayCard
                      key={driveway._id}
                      name={driveway.name}
                      drivewayCardId={driveway._id}
                      address={driveway.publicDisplay}
                      distance={driveway.walk}
                      images={driveway.images}
                      price={driveway.price}
                    />
                  ))
                )}
                </section>
              </div>
      
              {/* RIGHT SIDE — MAP */}
              <div className="map-section">
                <DrivewayMap driveways={filteredDriveways} />
              </div>
            </section>
          </div>
        </>
    )
}