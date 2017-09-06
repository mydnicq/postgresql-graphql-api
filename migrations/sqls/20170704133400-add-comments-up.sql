CREATE TABLE comments (
	id SERIAL PRIMARY KEY,
	comment TEXT,
	user_id INTEGER REFERENCES users,
	book_id INTEGER REFERENCES books,
	created_at TIMESTAMPTZ,
	updated_at TIMESTAMPTZ
);