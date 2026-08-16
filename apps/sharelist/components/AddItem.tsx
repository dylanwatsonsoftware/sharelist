import firebase from 'firebase/app';
import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { GoPlus, GoPrimitiveDot, GoX } from 'react-icons/go';
import styled from 'styled-components';
import { useSignedIn } from '../firebase/auth';
import { listCollection } from '../firebase/collections';
import { List, ListItem } from '../models/list';
import { Suggestion } from '../models/Suggestion';

const SearchArea = styled.div`
  position: relative;
  flex: 1;
`;

const AddItemInput = styled.input`
  border: none;
  border-bottom: 2px solid #e7e6e6;
  padding: 5px 0;
  outline: none;
  width: 100%;
  font-size: 1rem;
  line-height: 1rem;
`;

const Suggestions = styled.div`
  position: absolute;
  z-index: 10;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  overflow: hidden;
  border: 1px solid #e1e6eb;
  border-radius: 8px;
  background: white;
  box-shadow: 0 8px 24px rgba(13, 42, 68, 0.18);
`;

const SuggestionButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 54px;
  padding: 7px 9px;
  border: 0;
  border-bottom: 1px solid #eef1f4;
  background: ${({ active }) => (active ? '#edf5fa' : 'white')};
  color: #143757;
  cursor: pointer;
  text-align: left;

  &:last-child {
    border-bottom: 0;
  }

  img {
    width: 36px;
    height: 44px;
    margin-right: 9px;
    border-radius: 4px;
    object-fit: cover;
  }

  small {
    display: block;
    margin-top: 2px;
    color: #697887;
  }
`;

const AddButton = styled.button`
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
`;

const AddItem = ({ list }: { list: List }) => {
  const { isSignedIn, user } = useSignedIn();
  const isMyList = user?.uid == list.userId;
  const canEdit = isMyList || (isSignedIn && list.collaborate);
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/suggestions?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal }
        );
        if (!response.ok) return;
        const result = (await response.json()) as {
          suggestions?: Suggestion[];
        };
        setSuggestions(result.suggestions || []);
        setActiveIndex(-1);
      } catch (error) {
        if (!controller.signal.aborted) setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const addItem = useCallback(
    async (suggestion?: Suggestion) => {
      const name = suggestion?.name || query.trim();
      if (!name) return;
      const item: ListItem = {
        name,
        ...(suggestion?.image ? { image: suggestion.image } : {}),
        ...(suggestion?.url ? { url: suggestion.url } : {}),
        ...(suggestion
          ? { source: suggestion.source, externalId: suggestion.id }
          : {}),
        addedById: user?.uid,
        addedByName: user?.displayName,
      };
      await listCollection.doc(list.id).update({
        items: firebase.firestore.FieldValue.arrayUnion(item),
        updated: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setQuery('');
      setSuggestions([]);
      setShowInput(false);
    },
    [list.id, query, user?.displayName, user?.uid]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((index) =>
        index <= 0 ? suggestions.length - 1 : index - 1
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      void addItem(activeIndex >= 0 ? suggestions[activeIndex] : undefined);
    } else if (event.key === 'Escape') {
      setShowInput(false);
    }
  };

  return (
    <>
      {showInput && (
        <div className="list-item-link">
          <GoPrimitiveDot />
          <SearchArea>
            <AddItemInput
              type="text"
              role="combobox"
              aria-label="New item"
              aria-autocomplete="list"
              aria-expanded={suggestions.length > 0}
              placeholder="What's your favourite?"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {suggestions.length > 0 && (
              <Suggestions role="listbox">
                {suggestions.map((suggestion, index) => (
                  <SuggestionButton
                    key={suggestion.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    active={index === activeIndex}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void addItem(suggestion)}
                  >
                    {suggestion.image && (
                      <img src={suggestion.image} alt="" />
                    )}
                    <span>
                      {suggestion.name}
                      <small>{suggestion.subtitle}</small>
                    </span>
                  </SuggestionButton>
                ))}
                <SuggestionButton
                  type="button"
                  role="option"
                  aria-selected={false}
                  aria-label={`Add “${query.trim()}” as typed`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => void addItem()}
                >
                  <span>Add “{query.trim()}” as typed</span>
                </SuggestionButton>
              </Suggestions>
            )}
          </SearchArea>
          <AddButton
            type="button"
            aria-label="Cancel adding item"
            onClick={() => setShowInput(false)}
          >
            <GoX />
          </AddButton>
        </div>
      )}
      {!showInput && canEdit && (
        <>
          <AddButton
            className="action"
            type="button"
            aria-label="Add item"
            onClick={() => setShowInput(true)}
          >
            <GoPlus />
          </AddButton>
          <br />
          <br />
        </>
      )}
    </>
  );
};

export default AddItem;
