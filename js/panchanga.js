/*=========================================================
SARVAMCHANDHA
Temporary Monthly Panchanga Loader
=========================================================*/

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    loadDailyPanchanga();
});


async function loadDailyPanchanga() {

    const errorElement =
        document.getElementById("panchangaError");

    try {

        const today = getIndiaDateParts();

        const year = today.year;
        const month = String(today.month).padStart(2, "0");
        const day = String(today.day).padStart(2, "0");

        const dateKey = `${year}-${month}-${day}`;

        const monthlyFile =
            `data/panchanga-${year}-${month}.json`;

        setPanchangaLoadingState(true);

        const response = await fetch(monthlyFile, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                `Panchanga file unavailable: ${monthlyFile}`
            );
        }

        const monthlyData = await response.json();

        if (!monthlyData.days) {
            throw new Error(
                "The Panchanga JSON file does not contain a days object."
            );
        }

        const dailyData = monthlyData.days[dateKey];

        if (!dailyData) {
            throw new Error(
                `No Panchanga record found for ${dateKey}.`
            );
        }

        updatePanchangaHeader(
            dailyData,
            monthlyData.metadata
        );

        updatePanchangaCards(dailyData);

        setPanchangaLoadingState(false);

        if (errorElement) {
            errorElement.classList.remove("show");
        }

    } catch (error) {

        console.error(
            "Panchanga loading error:",
            error
        );

        setPanchangaLoadingState(false);

        if (errorElement) {

            errorElement.textContent =
                "Today's Panchanga information is temporarily unavailable.";

            errorElement.classList.add("show");

        }

        setUnavailableValues();

    }

}


/*=========================================================
INDIA DATE
=========================================================*/

function getIndiaDateParts() {

    const formatter =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );

    const parts =
        formatter.formatToParts(new Date());

    const values = {};

    parts.forEach((part) => {

        if (part.type !== "literal") {
            values[part.type] = part.value;
        }

    });

    return {
        year: Number(values.year),
        month: Number(values.month),
        day: Number(values.day)
    };

}


/*=========================================================
UPDATE HEADER
=========================================================*/

function updatePanchangaHeader(
    dailyData,
    metadata = {}
) {

    setText(
        "panchangaDate",
        formatDisplayDate(dailyData.date)
    );

    setText(
        "panchangaWeekday",
        dailyData.weekday || "—"
    );

    setText(
        "varaValue",
        dailyData.vara || "—"
    );

    const locationHeading =
        document.querySelector(
            ".panchanga-location h3"
        );

    if (
        locationHeading &&
        metadata.location
    ) {

        locationHeading.textContent =
            metadata.location;

    }

}


/*=========================================================
UPDATE CARDS
=========================================================*/

function updatePanchangaCards(data) {

    setText(
        "sunriseValue",
        valueOrDash(data.sunrise)
    );

    setText(
        "sunsetValue",
        valueOrDash(data.sunset)
    );

    setText(
        "tithiValue",
        valueOrDash(data.tithi)
    );

    setText(
        "tithiNote",
        buildEndTimeNote(
            "Ends",
            data.tithiEnd
        )
    );

    setText(
        "nakshatraValue",
        valueOrDash(data.nakshatra)
    );

    setText(
        "nakshatraNote",
        buildNakshatraNote(data)
    );

    setText(
        "yogaValue",
        valueOrDash(data.yoga)
    );

    setText(
        "karanaValue",
        valueOrDash(data.karana)
    );

    setText(
        "rahuKalamValue",
        valueOrDash(data.rahuKalam)
    );

    setText(
        "yamagandamValue",
        valueOrDash(data.yamagandam)
    );

    setText(
        "gulikaKalamValue",
        valueOrDash(data.gulikaKalam)
    );

    setText(
        "abhijitValue",
        valueOrDash(data.abhijitMuhurta)
    );

    setText(
        "pakshaValue",
        valueOrDash(data.paksha)
    );

}


/*=========================================================
HELPERS
=========================================================*/

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (element) {
        element.textContent = value;
    }

}


function valueOrDash(value) {

    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return "—";
    }

    return String(value);

}


function buildEndTimeNote(label, endTime) {

    if (!endTime) {
        return "End time unavailable";
    }

    return `${label}: ${endTime}`;

}


function buildNakshatraNote(data) {

    const details = [];

    if (data.nakshatraPada) {
        details.push(`Pada ${data.nakshatraPada}`);
    }

    if (data.nakshatraEnd) {
        details.push(`Ends ${data.nakshatraEnd}`);
    }

    return details.length > 0
        ? details.join(" • ")
        : "Lunar constellation";

}


function formatDisplayDate(isoDate) {

    if (!isoDate) {
        return "Date unavailable";
    }

    const date =
        new Date(`${isoDate}T12:00:00+05:30`);

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(date);

}


/*=========================================================
LOADING STATE
=========================================================*/

function setPanchangaLoadingState(isLoading) {

    const cards =
        document.querySelectorAll(
            ".panchanga-card"
        );

    cards.forEach((card) => {

        card.classList.toggle(
            "loading",
            isLoading
        );

    });

}


/*=========================================================
UNAVAILABLE STATE
=========================================================*/

function setUnavailableValues() {

    const valueElementIds = [
        "sunriseValue",
        "sunsetValue",
        "tithiValue",
        "nakshatraValue",
        "yogaValue",
        "karanaValue",
        "rahuKalamValue",
        "yamagandamValue",
        "gulikaKalamValue",
        "abhijitValue",
        "pakshaValue"
    ];

    valueElementIds.forEach((elementId) => {
        setText(elementId, "—");
    });

}