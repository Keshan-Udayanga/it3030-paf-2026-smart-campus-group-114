import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CommentSection.css";

function CommentSection({ ticketId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        if (ticketId) {
            fetchComments();
        }
    }, [ticketId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/v1/comments/ticket/${ticketId}`);
            setComments(res.data);
        } catch (err) {
            console.error("Error fetching comments:", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment || !authorName || !authorEmail) {
            alert("Please fill name, email and content");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/v1/comments", {
                ticketId,
                authorName,
                authorEmail,
                content: newComment
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    const handleUpdateComment = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/v1/comments/${id}`, {
                email: authorEmail,
                content: editContent
            });
            setEditingCommentId(null);
            fetchComments();
        } catch (err) {
            alert(err.response?.data || "Update failed");
        }
    };

    const handleDeleteComment = async (id) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            await axios.delete(`http://localhost:8080/api/v1/comments/${id}?email=${authorEmail}`);
            fetchComments();
        } catch (err) {
            alert(err.response?.data || "Delete failed");
        }
    };

    return (
        <div className="comment-section">
            <h4>Comments</h4>
            
            <div className="comment-user-info">
                <input 
                    placeholder="Your Name" 
                    value={authorName} 
                    onChange={(e) => setAuthorName(e.target.value)} 
                />
                <input 
                    placeholder="Your Email" 
                    value={authorEmail} 
                    onChange={(e) => setAuthorEmail(e.target.value)} 
                />
            </div>

            <div className="comment-list">
                {comments.length === 0 ? <p>No comments yet.</p> : comments.map(c => (
                    <div key={c.id} className="comment-card">
                        <div className="comment-header">
                            <strong>{c.authorName}</strong>
                            <span>{new Date(c.createdAt).toLocaleString()}</span>
                        </div>
                        
                        {editingCommentId === c.id ? (
                            <div className="edit-box">
                                <textarea 
                                    value={editContent} 
                                    onChange={(e) => setEditContent(e.target.value)} 
                                />
                                <button onClick={() => handleUpdateComment(c.id)}>Save</button>
                                <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <p className="comment-content">{c.content}</p>
                        )}

                        <div className="comment-actions">
                            <button onClick={() => {
                                setEditingCommentId(c.id);
                                setEditContent(c.content);
                            }}>Edit</button>
                            <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="add-comment">
                <textarea 
                    placeholder="Write a comment..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                />
                <button onClick={handleAddComment}>Add Comment</button>
            </div>
        </div>
    );
}

export default CommentSection;
