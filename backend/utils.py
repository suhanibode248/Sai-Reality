import bcrypt


def hash_password(password: str) -> str:
    """Hash a plaintext password with bcrypt."""
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(pwd_bytes, salt).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against the stored hash.
    Also supports fallback matching for raw/legacy passwords if any.
    """
    if not hashed_password:
        return False
    try:
        # If it looks like a bcrypt hash ($2b$, $2a$, etc.)
        if hashed_password.startswith("$2"):
            return bcrypt.checkpw(
                plain_password.encode('utf-8'),
                hashed_password.encode('utf-8')
            )
        # Fallback for plain-text comparison if unhashed
        return plain_password == hashed_password
    except Exception:
        return False
