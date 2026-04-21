import Link from "next/link";

const HomeBody = () => {
  return (
    <div>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=0.75, maximum-scale=0.75, user-scalable=yes"
      />
      <div id="body-wrapper" className="inner">
        <div id="sidebar">
          <div className="sidebar-item">
            Things you should know
            <Link href="https://www.evisa.gov.md/Info/ThingsYouShouldKnow?c=en-US">
              10 things you should know about the eVisa
            </Link>
          </div>
        </div>

        <div id="content">
          <div className="page-title-content">
            Entry visa to the Republic of Moldova
          </div>

          <div
            id="form_error_message"
            className="pageErrorMessage"
            style={{ display: "none" }}
          ></div>

          <div
            id="form_info_message"
            className="pageInfoMessage"
            style={{ display: "none" }}
          ></div>

          <div
            id="question"
            className="pageInfoMessage"
            style={{ display: "none" }}
          >
            <div id="question_titlu"></div>
            <div id="question_message"></div>
          </div>

          <div
            id="info"
            className="pageInfoMessage"
            style={{ display: "none" }}
          >
            <div id="info_titlu"></div>
            <div id="info_message"></div>
          </div>

          <div id="masterMainContent">
            <ul className="meniu-info">
              <li>
                <a
                  href="https://mfa.gov.md/en/content/visa-regime-foreigners"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Foreign citizens who do not require visa to enter the Republic
                  of Moldova
                </a>
              </li>

              <li>
                <a
                  href="https://mfa.gov.md/en/content/visa-regime-foreigners"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  List of countries whose nationals require invitations to apply
                  for a visa to enter the Republic of Moldova
                </a>
              </li>

              <li>
                <a
                  href="https://mfa.gov.md/en/content/types-visas-requirements"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The types of visas
                </a>
              </li>

              <li>
                <a
                  href="https://mfa.gov.md/en/content/types-visas-requirements"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visa fees
                </a>
              </li>
            </ul>

            <br />

            <strong>Alert us: </strong>
            <Link
              className="text-[#551a8b]"
              href="mailto:check-visa@evisa-gov-md.net"
            >
              check-visa@evisa-gov-md.net
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBody;
