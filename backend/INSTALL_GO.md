# Installing Go on macOS

## Option 1: Using Homebrew (Recommended)

If you have Homebrew installed:

```bash
brew install go
```

After installation, verify:
```bash
go version
```

You should see something like: `go version go1.21.x darwin/amd64`

## Option 2: Manual Installation

1. Download Go from https://go.dev/dl/
2. Download the macOS installer (`.pkg` file)
3. Run the installer
4. Verify installation:
```bash
go version
```

## Setting Up Go Environment (if needed)

After installation, Go should be in your PATH automatically. If not:

1. Add to your `~/.zshrc` or `~/.bash_profile`:
```bash
export PATH=$PATH:/usr/local/go/bin
```

2. Reload your shell:
```bash
source ~/.zshrc
```

## Verify Installation

```bash
go version
go env
```

## Next Steps

After Go is installed:

1. Navigate to backend directory:
```bash
cd backend
```

2. Download dependencies:
```bash
go mod download
```

3. Run the seed command:
```bash
make seed
```
