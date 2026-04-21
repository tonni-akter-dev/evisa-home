import React from "react";

const Footer = () => {
  return (
    <div id="footer-wrapper">
      <span style={{ color: "LightGray" }}>Version: 1.6.1.0</span>
      <table id="contact-info">
        <tr>
          <td style={{ width: "210px" }}>&nbsp;</td>
          <td>
            <strong>Email:</strong>
          </td>
          <td>
            <a href="mailto:check-visa@evisa-gov-md.net">check-visa@evisa-gov-md.net</a>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default Footer;
