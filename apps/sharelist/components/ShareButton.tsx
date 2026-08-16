import { useEffect, useRef, useState } from 'react';
import { BsShareFill } from 'react-icons/bs';
import styled from 'styled-components';

const Share = styled.span`
  float: right;
`;

const Button = styled.button`
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
`;

const Confirmation = styled.span`
  background: rgba(31, 41, 55, 0.95);
  border-radius: 0.5rem;
  bottom: 1.5rem;
  color: white;
  left: 50%;
  padding: 0.75rem 1rem;
  position: fixed;
  transform: translateX(-50%);
  z-index: 1000;
`;

interface ShareButtonProps {
  listId: string;
  listName: string;
}

export function ShareButton({ listId, listName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const confirmationTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (confirmationTimer.current) clearTimeout(confirmationTimer.current);
    },
    []
  );

  const share = async () => {
    const origin =
      typeof window === 'undefined'
        ? 'https://share-list.vercel.app'
        : window.location.origin;
    const url = `${origin}/list/${encodeURIComponent(listId)}`;
    const copyResult = navigator.clipboard
      ?.writeText(url)
      .then(() => true)
      .catch(() => false);

    const showCopiedConfirmation = () => {
      setCopied(true);
      confirmationTimer.current = setTimeout(() => setCopied(false), 2500);
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listName} | ShareList`,
          text: `Take a look at ${listName} on ShareList`,
          url,
        });
      } catch (error) {
        // Closing the native share popup is not an error the page needs to show.
      }
      if (await copyResult) showCopiedConfirmation();
      return;
    }

    if (await copyResult) {
      showCopiedConfirmation();
    } else {
      window.prompt('Copy this ShareList link:', url);
    }
  };

  return (
    <Share>
      <Button
        type="button"
        aria-label={`Share ${listName}`}
        title={`Share ${listName}`}
        onClick={share}
      >
        <BsShareFill />
      </Button>
      {copied && (
        <Confirmation role="status">Link copied to clipboard</Confirmation>
      )}
    </Share>
  );
}

export default ShareButton;
