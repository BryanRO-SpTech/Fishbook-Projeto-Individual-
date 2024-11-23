const [empty, fishery, param] = window.location.pathname.split("/");

const loadPage = async () => {
    const pageTitle = document.getElementById("title");

    if (param === "organizer") {
        pageTitle.innerHTML = "Pescas Criadas por você";

        loadOrganizerFisheries();
    } else {
        pageTitle.innerHTML = "Suas Reservas";
    }
};

const loadOrganizerFisheries = async () => {
    const reqFisheries = await fetch("/fishery/get/organizer")

    if (!reqFisheries.ok) {
        return setModal("Erro ao carregar pescarias", "Tente novamente mais tarde...", "error");
    }

    const resFishiries = await reqFisheries.json();

    document.getElementById("fishery-list").innerHTML = resFishiries.map((fishery) => {
        const formatDateTime = (unformattedDate) => {
            const date = new Date(unformattedDate)
            const time = date.getHours().toString().padStart(2, "0");
            const minutes = date.getMinutes().toString().padStart(2, "0");

            const formattedDateTime = date.toLocaleDateString("pt-br", { dateStyle: "short" }) + ` - ${time}:${minutes}`;

            return formattedDateTime;
        }

        const departureDateTime = formatDateTime(fishery.dateTimeDeparture);
        const returnDateTime = formatDateTime(fishery.dateTimeReturn);

        return `
            <div class="fishery">
            <div class="fishery-data">
                <div class="data-content">
                    <span class="data-name">Barco: <span class="data">${fishery.fisheryPointName}</span></span>
                    <span class="data-name">Almoço: <span class="data">${fishery.lunchIncludes ? "Sim" : "Não"}</span></span>
                    <span class="data-name">Preço: <span class="data">${(fishery.price).toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</span></span>
                </div>
                <div class="data-content">
                    <span class="data-name">Partida: <span class="data">${departureDateTime}</span></span>
                    <span class="data-name">Retorno: <span class="data">${returnDateTime}</span></span>
                </div>
                <div class="data-content">
                    <span class="data-name">Local de partida: <span class="data">${fishery.harborName}</span></span>
                    <span class="data-name">Ponto de Pesca: <span class="data">${fishery.fisheryPointName}</span></span>
                </div>
            </div>
            <div class="buttons">
                <button onclick="window.location.href = '#'" class="view-more-button">Ver mais</button>
                <button class="cancel-button" onclick="cancelFishery(this, '${fishery.idFishery}')">Cancelar</button>
            </div>
        </div>
        `;
    }).join("");
}


async function cancelFishery(buttonElement, fisheriId) {
    setLoader();

    const reqDelete = await fetch(`/fishery/delete/${fisheriId}`, {
        method: "DELETE"
    });

    removeLoader();

    if (!reqDelete.ok) {
        return setModal("Erro ao excluir pescaria", "Tente novamente mais tarde", "error");
    }

    buttonElement.parentNode.parentNode.remove();
    return setModal("Pescaria cancelada com sucesso.", "", "success");
}

window.onload = () => loadPage();