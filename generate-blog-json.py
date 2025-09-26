#!/usr/bin/env python3
"""
Automated Blog JSON Generator
Converts all markdown files in blog/ directory to JSON format for GitHub Pages compatibility.
Run this script whenever you add or update blog posts.
"""

import os
import json
import re
from pathlib import Path

def parse_frontmatter(content):
    """Parse YAML frontmatter from markdown content."""
    frontmatter = {}
    
    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter_text = parts[1].strip()
            content = parts[2].strip()
            
            # Parse simple YAML frontmatter
            for line in frontmatter_text.split('\n'):
                if ':' in line:
                    key, value = line.split(':', 1)
                    frontmatter[key.strip()] = value.strip()
    
    return frontmatter, content

def convert_markdown_to_json(md_file_path):
    """Convert a single markdown file to JSON."""
    print(f"Converting {md_file_path}...")
    
    try:
        with open(md_file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parse frontmatter and content
        frontmatter, markdown_content = parse_frontmatter(content)
        
        # Create blog data structure
        blog_data = {
            'title': frontmatter.get('title', 'Untitled'),
            'date': frontmatter.get('date', ''),
            'category': frontmatter.get('category', 'Uncategorized'),
            'description': frontmatter.get('description', ''),
            'readTime': frontmatter.get('readTime', ''),
            'content': markdown_content,
            'source_file': str(md_file_path),
            'generated_at': str(Path().absolute())
        }
        
        # Write JSON file
        json_file_path = md_file_path.with_suffix('.json')
        with open(json_file_path, 'w', encoding='utf-8') as f:
            json.dump(blog_data, f, indent=2, ensure_ascii=False)
        
        print(f"✓ Created {json_file_path}")
        return True
        
    except Exception as e:
        print(f"✗ Error converting {md_file_path}: {e}")
        return False

def main():
    """Main function to process all markdown files in blog directory."""
    blog_dir = Path('blog')
    
    if not blog_dir.exists():
        print("Blog directory not found!")
        return
    
    # Find all markdown files
    md_files = list(blog_dir.glob('*.md'))
    
    if not md_files:
        print("No markdown files found in blog directory.")
        return
    
    print(f"Found {len(md_files)} markdown files to convert...")
    
    success_count = 0
    for md_file in md_files:
        if convert_markdown_to_json(md_file):
            success_count += 1
    
    print(f"\nConversion complete: {success_count}/{len(md_files)} files converted successfully.")
    
    if success_count > 0:
        print("\n🚀 Ready to deploy!")
        print("Run these commands:")
        print("  git add .")
        print("  git commit -m 'Update blog posts'")
        print("  git push")

if __name__ == "__main__":
    main()
