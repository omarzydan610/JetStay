import React, { useEffect, useState, useCallback } from "react";
import { getFlightsGraph } from "../../../services/AirlineServices/flightsService";
import FlightFilters from "../../../components/HomePages/User/FlightsBooking/FlightFilters";
import FlightsList from "../../../components/HomePages/User/FlightsBooking/FlightsList";
import FlightDetailsPanel from "../../../components/HomePages/User/FlightsBooking/FlightDetailsPanel";
import { toast } from "react-toastify";

export default function FlightSearchPage() {
  const [flights, setFlights] = useState([]);
  const [page, setPage] = useState(0);
  const size = 20;
  const [loading, setLoading] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState(null);
  const [filter, setFilter] = useState({});

  const [form, setForm] = useState({
    airlineNameContains: "",
    departureCityContains: "",
    arrivalCityContains: "",
    departureCountryContains: "",
    arrivalCountryContains: "",
    departureDateGte: "",
    tripTypePrice: "50",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value) return null;
    if (name === "tripTypePrice") {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0) return "Enter a valid non-negative number";
    }
    return null;
  };

  function handleInputChange(name, value) {
    setForm((s) => ({ ...s, [name]: value }));
    const err = validateField(name, value);
    setErrors((prev) => {
      const copy = { ...prev };
      if (err) copy[name] = err;
      else delete copy[name];
      return copy;
    });
  }

  const loadFlights = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getFlightsGraph(page, size, filter);
      const flightsData = res?.data ?? [];

      const flightsWithIDs = flightsData.map((f) => ({
        ...f,
        departureAirportInt: f.departureAirport?.airportID ?? null,
        arrivalAirportInt: f.arrivalAirport?.airportID ?? null,
      }));

      setFlights(flightsWithIDs);
    } catch (err) {
      console.error("Error loading flights", err);
      toast.error("Failed to load flights");
    } finally {
      setLoading(false);
    }
  }, [page, size, filter]);

  useEffect(() => {
    loadFlights();
  }, [loadFlights]);

  const applyFilters = () => {
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix filter errors before applying");
      return;
    }

    const cleaned = {};
    if (form.airlineNameContains)
      cleaned.airlineNameContains = form.airlineNameContains;
    if (form.departureCityContains)
      cleaned.departureCityContains = form.departureCityContains;
    if (form.arrivalCityContains)
      cleaned.arrivalCityContains = form.arrivalCityContains;
    if (form.departureCountryContains)
      cleaned.departureCountryContains = form.departureCountryContains;
    if (form.arrivalCountryContains)
      cleaned.arrivalCountryContains = form.arrivalCountryContains;
    if (form.departureDateGte) {
      const normalizedGte = `${form.departureDateGte}T00:00:00`;
      cleaned.departureDateGte = normalizedGte;
    }
    if (form.tripTypePrice) {
      const price = Number(form.tripTypePrice);
      const DELTA = 200;
      if (!Number.isNaN(price)) {
        cleaned.tripTypePriceGte = Math.max(0, price - DELTA);
        cleaned.tripTypePriceLte = price + DELTA;
      }
    }

    setFilter(cleaned);
    setPage(0);
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setPage((prev) => prev + 1);

  const clearFilters = () => {
    setForm({
      airlineNameContains: "",
      departureCityContains: "",
      arrivalCityContains: "",
      departureCountryContains: "",
      arrivalCountryContains: "",
      departureDateGte: "",
      tripTypePrice: "50",
    });
    setFilter({});
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50">
      {/* Filter Panel */}
      <FlightFilters
        form={form}
        handleInputChange={handleInputChange}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Results */}
      <FlightsList
        flights={flights}
        loading={loading}
        page={page}
        onFlightSelect={setSelectedFlightId}
        onPrevPage={handlePrev}
        onNextPage={handleNext}
      />

      {/* Flight Details Panel Overlay */}
      {selectedFlightId && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedFlightId(null)}
          />
          <FlightDetailsPanel
            flight={flights.find((f) => f.flightID === selectedFlightId)}
            onClose={() => setSelectedFlightId(null)}
          />
        </>
      )}
    </div>
  );
}
