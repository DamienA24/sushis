import React, { useState } from "react";

import TwitterIcon from "@mui/icons-material/Twitter";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LinkIcon from "@mui/icons-material/Link";
import Snackbar from "@mui/material/Snackbar";
import SvgIcon from "@mui/material/SvgIcon";
import Fade from "@mui/material/Fade";

function ShareNft({ currentAccount, classSup }) {
  const [open, setOpen] = useState(false);

  function copyToClipboard(e) {
    e.preventDefault();
    const origin = window.location.origin;
    const url = `${origin}/nfts/${currentAccount}`;
    navigator.clipboard.writeText(url);
    setOpen(true);
  }

  function copyToTwitter(e) {
    e.preventDefault();
    const origin = window.location.origin;
    const url = `${origin}/nfts/${currentAccount}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=Look my sushis! ${url}`;
    window.open(twitterUrl, "_blank");
  }

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  }

  const action = (
    <React.Fragment>
      <button color="secondary" size="small" onClick={handleClose} />

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div className={`container-share-nfts ${classSup}`}>
      <SvgIcon
        classes={{
          root: "icon-share-nft icon-left",
        }}
        onClick={copyToTwitter}
      >
        <TwitterIcon />
      </SvgIcon>
      <SvgIcon
        classes={{
          root: "icon-share-nft",
        }}
        onClick={copyToClipboard}
      >
        <LinkIcon />
      </SvgIcon>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
        onClose={handleClose}
        message="Link copied"
        action={action}
      />
    </div>
  );
}

export default ShareNft;
