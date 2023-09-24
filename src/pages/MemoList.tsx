import { Box, Button, ListItem, ListItemText, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { searchMemo } from "../services/searchMemo";
import { Memo } from "../services/memoType";
import { useRecoilState } from "recoil";
import { userAtom } from "../states/userAtom";
import { useNavigate } from "react-router-dom";

export function MemoList(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const [memoList, setMemoList] = useState<Memo[]>([]);
  const navigate = useNavigate();

  const moveToMemo = (id?: string) => {
    if (id) {
      navigate(`/memo/${id}`);
    } else {
      navigate(`/memo`);
    }
  };

  useEffect(() => {
    const getMemoList = async () => {
      const memoList = await searchMemo(loginUser);
      if (memoList) {
        setMemoList(memoList);
      }
    };

    getMemoList();
  }, [loginUser]);

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
              onClick={() => moveToMemo(memo.id)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemText primary={memo.title} secondary={memo.content} />
            </ListItem>
          );
        })}
      </Box>
    </>
  );
}
