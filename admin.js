import { createClient } from
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL =
    "https://wlyugtvzgyjsaflsbvne.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_pTSQssK7uf65ltdhPtI6Ow_PBzpTuZk";


const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// HTML elements

const tableBody =
    document.getElementById("enquiryTableBody");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("errorMessage");

const totalEnquiries =
    document.getElementById("totalEnquiries");

const refreshBtn =
    document.getElementById("refreshBtn");


// ======================================================
// LOAD ENQUIRIES
// ======================================================

async function loadEnquiries() {

    loading.style.display = "block";

    errorMessage.textContent = "";

    tableBody.innerHTML = "";


    const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", {
            ascending: false
        });


    loading.style.display = "none";


    // Error

    if (error) {

        console.error(error);

        errorMessage.textContent =
            "Unable to load enquiries.";

        totalEnquiries.textContent =
            "Error loading enquiries.";

        return;

    }


    // Number of enquiries

    totalEnquiries.textContent =
        `${data.length} enquiry(s) received`;


    // No enquiries

    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No enquiries yet.
                </td>
            </tr>
        `;

        return;

    }


    // Display enquiries

    data.forEach(enquiry => {

        const row =
            document.createElement("tr");


        const date =
            enquiry.created_at
                ? new Date(
                    enquiry.created_at
                  ).toLocaleString()
                : "-";


        row.innerHTML = `

            <td>
                ${escapeHTML(enquiry.name)}
            </td>

            <td>
                ${escapeHTML(enquiry.email)}
            </td>

            <td>
                ${escapeHTML(enquiry.phone || "-")}
            </td>

            <td>
                ${escapeHTML(enquiry.service)}
            </td>

            <td class="message-cell">
                ${escapeHTML(enquiry.message)}
            </td>

            <td>
                ${date}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


// ======================================================
// SECURITY HELPER
// ======================================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ======================================================
// REFRESH
// ======================================================

refreshBtn.addEventListener(
    "click",
    loadEnquiries
);


// ======================================================
// INITIAL LOAD
// ======================================================

loadEnquiries();