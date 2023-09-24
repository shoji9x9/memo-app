import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { userAtom } from "../states/userAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { saveMemo } from "../services/saveMemo";
import { useEffect, useState } from "react";
import { messageAtom } from "../states/messageAtom";
import { useNavigate, useParams } from "react-router-dom";
import { searchMemoById } from "../services/searchMemo";

export function Memo(): JSX.Element {
  const [loginUser] = useRecoilState(userAtom);
  const setMessageAtom = useSetRecoilState(messageAtom);

  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [content, setContent] = useState("");

  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  const backToMemoList = () => {
    navigate("/memolist");
  };

  const save = async () => {
    if (!title) {
      setTitleError(true);
      return;
    }
    const updatedAt = new Date();
    await saveMemo({ id, title, content, updatedAt }, loginUser);
    setMessageAtom((prev) => {
      return {
        ...prev,
        open: true,
        text: "Saved",
        severity: "success",
      };
    });

    backToMemoList();
  };

  useEffect(() => {
    // メモの編集の場合はメモを取得する
    const get = async () => {
      if (!id) {
        return;
      }
      const memo = await searchMemoById(id, loginUser);
      if (memo) {
        setTitle(memo.title);
        setContent(memo.content);
      }
    };

    get();
  }, [id, loginUser]);

  return (
    <>
      <Typography variant="h2">Crate memo</Typography>
      <Box
        sx={{
          paddingTop: "40px",
          paddingBottom: "40px",
        }}
      >
        <Grid container spacing={2} sx={{ width: "50%" }}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              variant="outlined"
              required
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={titleError}
              helperText={titleError ? "Title is required" : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Content"
              multiline
              rows={4}
              fullWidth
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={() => save()}>
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => backToMemoList()}
              sx={{ marginLeft: 2 }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
