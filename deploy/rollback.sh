#!/bin/bash

# Tokyo Story Rollback Script
# This script helps rollback to a previous version in case of issues

set -e

echo "🔄 Tokyo Story Rollback Script"
echo "================================"

# Configuration
BACKEND_URL="https://tokyostorynew.onrender.com"
FRONTEND_URL="https://tokyo-story-new.vercel.app"
GITHUB_REPO="your-username/tokyo-story"

# Function to check if a commit exists
check_commit() {
    local commit_hash=$1
    if git cat-file -e "$commit_hash^{commit}" 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

# Function to rollback to a specific commit
rollback_to_commit() {
    local commit_hash=$1
    echo "📋 Rolling back to commit: $commit_hash"
    
    # Check if commit exists
    if ! check_commit "$commit_hash"; then
        echo "❌ Error: Commit $commit_hash does not exist"
        exit 1
    fi
    
    # Create backup branch
    local backup_branch="backup-$(date +%Y%m%d-%H%M%S)"
    echo "💾 Creating backup branch: $backup_branch"
    git checkout -b "$backup_branch"
    git push origin "$backup_branch"
    
    # Switch back to main and reset
    git checkout main
    git reset --hard "$commit_hash"
    git push origin main --force
    
    echo "✅ Rollback completed to commit: $commit_hash"
    echo "📝 Backup created at branch: $backup_branch"
}

# Function to rollback to previous commit
rollback_previous() {
    echo "📋 Rolling back to previous commit"
    local previous_commit=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)
    rollback_to_commit "$previous_commit"
}

# Function to show recent commits
show_recent_commits() {
    echo "📋 Recent commits:"
    echo "=================="
    git log --oneline -10
}

# Function to check deployment status
check_deployment_status() {
    echo "🔍 Checking deployment status..."
    
    # Check backend health
    echo "Backend health check:"
    if curl -s "$BACKEND_URL/api/health" > /dev/null; then
        echo "✅ Backend is healthy"
    else
        echo "❌ Backend is not responding"
    fi
    
    # Check frontend
    echo "Frontend check:"
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo "✅ Frontend is accessible"
    else
        echo "❌ Frontend is not accessible"
    fi
}

# Function to restore from backup
restore_from_backup() {
    local backup_branch=$1
    if [ -z "$backup_branch" ]; then
        echo "Available backup branches:"
        git branch -r | grep backup
        echo "Usage: $0 restore <backup-branch-name>"
        exit 1
    fi
    
    echo "🔄 Restoring from backup: $backup_branch"
    git checkout main
    git reset --hard "origin/$backup_branch"
    git push origin main --force
    echo "✅ Restored from backup: $backup_branch"
}

# Main script logic
case "$1" in
    "commit")
        if [ -z "$2" ]; then
            echo "Usage: $0 commit <commit-hash>"
            exit 1
        fi
        rollback_to_commit "$2"
        ;;
    "previous")
        rollback_previous
        ;;
    "list")
        show_recent_commits
        ;;
    "status")
        check_deployment_status
        ;;
    "restore")
        restore_from_backup "$2"
        ;;
    *)
        echo "Tokyo Story Rollback Script"
        echo "Usage: $0 {commit|previous|list|status|restore}"
        echo ""
        echo "Commands:"
        echo "  commit <hash>  - Rollback to specific commit"
        echo "  previous      - Rollback to previous commit"
        echo "  list          - Show recent commits"
        echo "  status        - Check deployment status"
        echo "  restore <branch> - Restore from backup branch"
        echo ""
        echo "Examples:"
        echo "  $0 previous"
        echo "  $0 commit abc1234"
        echo "  $0 status"
        echo "  $0 restore backup-20231201-143022"
        exit 1
        ;;
esac
