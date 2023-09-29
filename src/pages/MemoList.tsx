import {
  Box,
  Button,
  IconButton,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";
import { searchMemo } from "../services/searchMemo";
import { Memo } from "../services/memoType";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { useNavigate } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { deleteMemo } from "../services/deleteMemo";
import { messageAtom } from "../states/messageAtom";
import { SimpleDialog } from "../components/SimpleDialog";

export function MemoList(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMemoId, setSelectedMemoId] = useState<string | undefined>();
  const [clickDelete, setClickDelete] = useState(false);
  const navigate = useNavigate();

  const moveToMemo = (id?: string) => {
    if (id) {
      navigate(`/memo/${id}`);
    } else {
      navigate(`/memo`);
    }
  };

  const getMemoList = useCallback(async () => {
    const _memoList = await searchMemo(loginUser);
    if (_memoList) {
      setMemoList(_memoList);
    }
    console.log(_memoList);
  }, [loginUser, setMemoList]);

  const onClickDelete = async (id?: string) => {
    if (!id) {
      return;
    }
    setClickDelete(true);
    // TODO: 例外をキャッチしメッセージを出しわける
    // TODO: メッセージを作成するユーティリティーを作る
    deleteMemo(id, loginUser);
    setMessageAtom((prev) => {
      return {
        ...prev,
        open: true,
        text: "Deleted",
        severity: "success",
      };
    });
  };

  useEffect(() => {
    getMemoList();
    setClickDelete(false);
  }, [loginUser, getMemoList, clickDelete]);

  return (
    <>
      <Typography variant="h2">Memo</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={() => moveToMemo()}>
            New memo
          </Button>
        </Box>
        {memoList.map((memo) => {
          return (
            <ListItem
              alignItems="flex-start"
              key={memo.id}
              sx={{ cursor: "pointer" }}
              secondaryAction={
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    setSelectedMemoId(memo.id);
                    setOpenDialog(true);
                  }}
                >
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText
                primary={memo.title}
                secondary={memo.content}
                onClick={() => moveToMemo(memo.id)}
              />
            </ListItem>
          );
        })}
      </Box>
      <SimpleDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        title="Confirmation"
        content="Are you sure you want to permanently delete this?"
        actions={[
          {
            text: "Delete",
            onClick: () => {
              onClickDelete(selectedMemoId);
              setOpenDialog(false);
            },
          },
          {
            text: "Cancel",
            onClick: () => {
              setOpenDialog(false);
            },
            autoFocus: true,
          },
        ]}
      />
    </>
  );
}
