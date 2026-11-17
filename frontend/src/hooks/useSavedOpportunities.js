import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getSavedOpportunities,
  removeSavedOpportunity,
  saveOpportunity,
  updateSavedStatus,
} from "../api/savedOpportunitiesAPI.js";

const NO_ITEMS = [];

export function useSavedOpportunities(user) {
  const [savedItems, setSavedItems] = useState(NO_ITEMS);
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState("");
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return undefined;
    let ignore = false;
    getSavedOpportunities()
      .then((items) => {
        if (!ignore) setSavedItems(items);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [userId]);

  const visibleItems = userId ? savedItems : NO_ITEMS;

  const savedByOpportunityId = useMemo(
    () => new Map(visibleItems.map((item) => [item.opportunityId, item])),
    [visibleItems]
  );

  const save = useCallback(async (opportunityId, status) => {
    const item = await saveOpportunity(opportunityId, status);
    setSavedItems((items) => [...items, item]);
  }, []);

  const changeStatus = useCallback(async (savedId, status) => {
    const updated = await updateSavedStatus(savedId, status);
    setSavedItems((items) =>
      items.map((item) =>
        item._id === savedId ? { ...item, ...updated } : item
      )
    );
  }, []);

  const remove = useCallback(async (savedId) => {
    await removeSavedOpportunity(savedId);
    setSavedItems((items) => items.filter((item) => item._id !== savedId));
  }, []);

  return {
    savedItems: visibleItems,
    savedByOpportunityId,
    loading,
    error,
    save,
    changeStatus,
    remove,
  };
}
