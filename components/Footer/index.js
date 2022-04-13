import React from "react";

import Image from "next/image";

import DiscordIcon from "../../assets/discordIcon.svg";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import SvgIcon from "@mui/material/SvgIcon";

function Footer() {
  function handleDiscordClick() {
    //TODO: add discord link
    window.open("https://discord.gg/3qmqm6U", "_blank");
  }

  function handleTelegramClick() {
    //TODO :add telegram link
    window.open("https://t.me/sushis_io", "_blank");
  }

  function handleTwitterClick() {
    //TODO :add twitter link
    window.open("https://twitter.com/sushis_io", "_blank");
  }

  return (
    <div className="container-footer">
      <div className="container-icon">
        <SvgIcon>
          <TwitterIcon onClick={handleTwitterClick} />
        </SvgIcon>
        <SvgIcon>
          <TelegramIcon onClick={handleTelegramClick} />
        </SvgIcon>
        <Image
          src={DiscordIcon}
          width={25}
          height={25}
          onClick={handleDiscordClick}
        />
      </div>
    </div>
  );
}

export default Footer;
