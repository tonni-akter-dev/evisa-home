import Image from "next/image";
import Link from "next/link";
import evisa from "../../public/eVisa.png";
import logo from "../../public/logo.gif";

const Header = () => {
  return (
    <div id="header-wrapper">
      <div id="header-emblem">
        <Link id="header-title" href="#">
          <Image  src={logo} alt="" />
          <span>
            MINISTRY OF FOREIGN AFFAIRS AND EUROPEAN INTEGRATION OF THE REPUBLIC
            OF MOLDOVA
          </span>
        </Link>
      </div>

      <div id="header-right">
        <span className="mb-2">
          <Image src={evisa} width={187} height={79} alt="eVisa" />
        </span>

        <div className="languages">
          <a href="?c=ro-RO" className="langRO">
            &nbsp;
          </a>
          <a href="?c=en-US" className="langEN-passive">
            &nbsp;
          </a>
        </div>
      </div>

      <ul id="horizontal-menu" className="sf-menu">
        <li className="menu-item-level1 col1 menu-color2">
          <Link href="/">Home</Link>
        </li>

        <li className="menu-item-level1 col2 menu-color3">
          <Link
            href="https://www.mfa.gov.md/ro/content/regimul-de-vize"
            target="_blank"
            rel="noopener noreferrer"
          >
            Do I need a visa?
          </Link>
        </li>

        <li className="menu-item-level1 col3 menu-color4">
          <Link href="https://www.evisa.gov.md/VisaFile/Inregistrare">
            Apply now
          </Link>
        </li>

        <li className="menu-item-level1 col4 menu-color5">
          <Link href="https://www.evisa.gov.md/VisaFile/Continua">
            Continue application
          </Link>
        </li>

        <li className="menu-item-level1 col5 menu-color1">
          <Link href="https://www.evisa.gov.md/VisaFile/Verifica">
            Check your application status
          </Link>
        </li>

        <li className="menu-item-level1 col6 menu-color2">
          <Link href="/check-my-visa">Check visa</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
